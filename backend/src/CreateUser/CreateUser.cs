using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using MongoDB.Driver;
using MongoDBConfig;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace CreateUser;

public class Function
{
    private const string CollectionName = "users"; 

    public static async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            var userFromRequest = JsonSerializer.Deserialize<User>(request.Body);

            var collection = MongoDbClient.Database.GetCollection<User>(CollectionName);

            if (
            string.IsNullOrEmpty(userFromRequest.Name) ||
            string.IsNullOrEmpty(userFromRequest.Email) ||
            string.IsNullOrEmpty(userFromRequest.Role) ||
            string.IsNullOrEmpty(userFromRequest.Pic) ||
            string.IsNullOrEmpty(userFromRequest.PasswordHash)
            )
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 500,
                    Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Missing Fields" } }),
                    Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                };
            }
            

            var newUser = new User
            {
                Name = userFromRequest.Name,
                Email = userFromRequest.Email,
                Role = userFromRequest.Role,
                Pic = userFromRequest.Pic,
                IsAdmin = userFromRequest.IsAdmin,
            };

            newUser.HashPassword(userFromRequest.PasswordHash);

            await collection.InsertOneAsync(newUser);
            
            var count = await collection.CountDocumentsAsync(_ => true);

            context.Logger.LogInformation($"Document inserted with ID: {newUser.id}");
            context.Logger.LogInformation($"New amount of documents: {count}");

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "User added successfully!" } }),
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }
        catch (Exception ex)
        {
            return new APIGatewayProxyResponse
            {
                StatusCode = 500,
                Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", ex.Message }, { "request", request.ToString() } }),
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };
        }
    }

}