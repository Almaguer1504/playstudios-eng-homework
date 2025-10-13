using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Net;
using Amazon.Lambda.APIGatewayEvents;
using System.Collections.Generic;
using System.Text.Json;
using Amazon.Lambda.Core;


[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace TokenUtils;

public static class TokenGenerator
{
    // Values For Testing
    private static readonly string jwtSecret =
        Environment.GetEnvironmentVariable("JWT_SECRET")
        ?? "this is my custom Secret key for authentication";
    private static readonly string Issuer =
        Environment.GetEnvironmentVariable("TOKEN_ISSUER")
        ?? "abe";
    private static readonly string Audience =
         Environment.GetEnvironmentVariable("TOKEN_AUDIENCE")
        ?? "dev";

    public static APIGatewayProxyResponse GenerateToken(string id)
    {
        var token_expiration_time = 1;
        var key = Encoding.UTF8.GetBytes(jwtSecret);
        var claims = new[]
        {
            new Claim("id", id),
            new Claim(JwtRegisteredClaimNames.Sub, id)
        };

        var securityKey = new SymmetricSecurityKey(key);

        var signingCredentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Issuer = Issuer,
            Audience = Audience,

            Expires = DateTime.UtcNow.AddHours(token_expiration_time),

            SigningCredentials = signingCredentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);


        var expirationDate = DateTime.UtcNow.AddHours(token_expiration_time).ToString("R");
        var token = tokenHandler.WriteToken(securityToken);
        /*
        COOKIE FOR LOCAL TESTING
            string cookieHeader = $"jwt={token}; Expires={expirationDate}; HttpOnly; SameSite=Lax; Path=/";
        COOKIE FOR PRODUCTION
            string cookieHeader = $"jwt={token}; Expires={expirationDate}; HttpOnly; SameSite=None; Secure; Path=/";
        */
        string cookieHeader = $"jwt={token}; Expires={expirationDate}; HttpOnly; Path=/";

        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Headers = new Dictionary<string, string>
            {
                { "Content-Type", "application/json" },
                { "Set-Cookie", cookieHeader }
            },
            Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Login success, token stored on cookie" } })
        };
    }


    public static APIGatewayProxyResponse RemoveToken()
    {
        /*
        COOKIE FOR LOCAL TESTING
            string cookieHeader = $"jwt=; MaxAge=0; HttpOnly; SameSite=Lax; Path=/";
        COOKIE FOR PRODUCTION
            string cookieHeader = $"jwt=; MaxAge=0; HttpOnly; SameSite=None; Secure; Path=/";
        */
        string cookieHeader = $"jwt=; MaxAge=0; HttpOnly; Path=/";

        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Headers = new Dictionary<string, string>
            {
                { "Content-Type", "application/json" },
                { "Set-Cookie", cookieHeader }
            },
            Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Login success, token stored on cookie" } })
        };
    }
}

public static class TokenValidator
{
    private static readonly string jwtSecret =
        Environment.GetEnvironmentVariable("JWT_SECRET")
        ?? "this is my custom Secret key for authentication";
    private static readonly string Issuer =
        Environment.GetEnvironmentVariable("TOKEN_ISSUER")
        ?? "abe";
    private static readonly string Audience =
         Environment.GetEnvironmentVariable("TOKEN_AUDIENCE")
        ?? "dev";

    public static TokenResponse ValidateToken(APIGatewayCustomAuthorizerRequest request, ILambdaContext context)
    {
        context.Logger.LogInformation("Starting token validation...");

        if (string.IsNullOrEmpty(jwtSecret))
        {
            context.Logger.LogError("FATAL: JWT_SECRET environment variable is not set.");
            return new TokenResponse
            {
                Is_Valid_Token = false,
                User_ID = ""
            };
        }

        string? token = ExtractTokenFromCookie(request.Headers);

        if (string.IsNullOrEmpty(token))
        {
            context.Logger.LogWarning("Token 'jwt' not found in Cookie header.");
            return new TokenResponse
            {
                Is_Valid_Token = false,
                User_ID = ""
            };
        }

        ClaimsPrincipal? principal = ValidateToken(token, jwtSecret, context);

        if (principal == null)
        {
            context.Logger.LogWarning("Token validation failed.");
            return new TokenResponse
            {
                Is_Valid_Token = false,
                User_ID = ""
            };
        }

        context.Logger.LogInformation($"Token successfully validated for user ID: {principal.FindFirst("id")?.Value}");

        return new TokenResponse
        {
            Is_Valid_Token = true,
            User_ID = principal.FindFirst("id")?.Value ?? "not found"
        };
    }

    public class TokenResponse
    {
        public bool Is_Valid_Token { get; set; }
        public required string User_ID { get; set; }
    }

    private static string? ExtractTokenFromCookie(IDictionary<string, string> headers)
    {
        if (headers.TryGetValue("Cookie", out string? cookieString) ||
            headers.TryGetValue("cookie", out cookieString))
        {
            var cookies = cookieString.Split(';');
            foreach (var cookie in cookies)
            {
                var trimmedCookie = cookie.Trim();
                if (trimmedCookie.StartsWith("jwt="))
                {
                    return trimmedCookie["jwt=".Length..];
                }
            }
        }
        return null;
    }

    private static ClaimsPrincipal? ValidateToken(string token, string jwtSecret, ILambdaContext context)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(jwtSecret);

        var tokenValidationParameters = new TokenValidationParameters
        {

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),


            ValidateIssuer = true,
            ValidIssuer = Issuer,
            ValidateAudience = true,
            ValidAudience = Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            SecurityToken validatedToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
            return principal;
        }
        catch (SecurityTokenExpiredException)
        {
            context.Logger.LogWarning("Token is expired.");
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Token validation exception: {ex.Message}");
        }
        return null;
    }
}
