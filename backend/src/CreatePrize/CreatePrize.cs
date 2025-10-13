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

namespace CreatePrize;

public class Function
{
    private const string CollectionName = "prizes"; 

    public static async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            var prizeFromRequest = JsonSerializer.Deserialize<Prize>(request.Body);

            var collection = MongoDbClient.Database.GetCollection<Prize>(CollectionName);

            if (
            string.IsNullOrEmpty(prizeFromRequest.Name) ||
            string.IsNullOrEmpty(prizeFromRequest.Description) ||
            string.IsNullOrEmpty(prizeFromRequest.Category) ||
            string.IsNullOrEmpty(prizeFromRequest.ImageUrl)
            )
            return new APIGatewayProxyResponse
            {
                StatusCode = 500,
                Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Missing Fields" } }),
                Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
            };

            var newPrize = new Prize 
            {
                Name = prizeFromRequest.Name,
                Description = prizeFromRequest.Description,
                Price = prizeFromRequest.Price,
                Category = prizeFromRequest.Category,
                ImageUrl = prizeFromRequest.ImageUrl
            };

            await collection.InsertOneAsync(newPrize);
            
            var count = await collection.CountDocumentsAsync(_ => true);

            context.Logger.LogInformation($"Document inserted with ID: {newPrize.id}");
            context.Logger.LogInformation($"New amount of documents: {count}");

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Prize added successfully!" } }),
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