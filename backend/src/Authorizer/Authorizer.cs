using System.Collections.Generic;
using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;


[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Authorizer;

public static class TokenAuthorizer
{

    public static AuthorizerResponse Handle(APIGatewayCustomAuthorizerRequest request, ILambdaContext context)
    {
        var tokenValidation = TokenUtils.TokenValidator.ValidateToken(request, context);

        if (!tokenValidation.Is_Valid_Token)
        {
            return new AuthorizerResponse
            {
                isAuthorized = false,
                context = new Dictionary<string, string>
        {
            { "userId", tokenValidation.User_ID }
        }
            };
        }

        return new AuthorizerResponse
        {
            isAuthorized = true,
            context = new Dictionary<string, string>
        {
            { "userId", tokenValidation.User_ID }
        }
        };
    }

    public class AuthorizerResponse
    {
        public bool isAuthorized { get; set; }
        public Dictionary<string, string> context { get; set; }
    }

}




