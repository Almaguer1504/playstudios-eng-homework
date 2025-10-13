using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using System.Text.Json;
using MongoDBConfig;
using System.Threading.Tasks;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using TokenUtils;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace UserLogin;

public class Login
{

    private const string CollectionName = "users";

    public static async Task<APIGatewayProxyResponse> AuthUserHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Body))
            {
                return CreateErrorResponse(HttpStatusCode.BadRequest, "Request body is missing.");
            }

            var authRequest = JsonSerializer.Deserialize<AuthRequest>(request.Body);

            if (authRequest == null || string.IsNullOrEmpty(authRequest.Email) || string.IsNullOrEmpty(authRequest.Password))
            {
                return CreateErrorResponse(HttpStatusCode.BadRequest, "Email and Password are required.");
            }

            var collection = MongoDbClient.Database.GetCollection<User>(CollectionName);

            var filter = Builders<User>.Filter.Eq("Email", authRequest.Email);

            var user_cursor = await collection.FindAsync<User>(filter);

            var user = await user_cursor.FirstOrDefaultAsync();

            if (user != null && user.MatchPassword(authRequest.Password))
            {
                var authResponse = new User
                {
                    id = user.id,
                    Name = user.Name,
                    Role = user.Role,
                    Email = user.Email,
                    IsAdmin = user.IsAdmin,
                    Pic = user.Pic
                };

                var token_response = TokenGenerator.GenerateToken(user.id.ToString());
                token_response.Body = JsonSerializer.Serialize(authResponse);
                return token_response;
            }
            else
            {
                return CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid Email or Password");
            }
        }
        catch (JsonException)
        {
            return CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid JSON format.");
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error during authentication: {ex.Message}");
            return CreateErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }

    public static async Task<APIGatewayProxyResponse> UnauthUserHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            var token_response = TokenGenerator.RemoveToken();
            return token_response;
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error during authentication: {ex.Message}");
            return CreateErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }
    private static APIGatewayProxyResponse CreateErrorResponse(HttpStatusCode statusCode, string message)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = (int)statusCode,
            Body = JsonSerializer.Serialize(new { message }),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}

public class AuthRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

