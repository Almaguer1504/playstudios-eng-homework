using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDBConfig;
using System.Net;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace DeletePrize;

public class Function
{
    private const string CollectionName = "prizes";

    public static async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
    {
        try
        {
            context.Logger.LogInformation("Deleting...");

            var url_id = request.PathParameters.TryGetValue("id", out string id);

            if (!url_id || string.IsNullOrEmpty(id))
            {
                return CreateResponse(HttpStatusCode.BadRequest, "{\"message\": \"ID required.\"}");
            }

            var is_object_id = ObjectId.TryParse(id, out ObjectId objectId);

            if (!is_object_id)
            {
                return CreateResponse(HttpStatusCode.BadRequest, "{\"message\": \"Invalid ID.\"}");
            }

            var collection = MongoDbClient.Database.GetCollection<BsonDocument>(CollectionName);

            var filter = Builders<BsonDocument>.Filter.Eq("_id", objectId);

            await collection.DeleteOneAsync(filter);

            var count = await collection.CountDocumentsAsync(_ => true);

            context.Logger.LogInformation($"New amount of documents: {count}");

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonSerializer.Serialize(new Dictionary<string, string> { { "message", "Prize deleted successfully!" } }),
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
    private static APIGatewayProxyResponse CreateResponse(HttpStatusCode statusCode, string body)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = (int)statusCode,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } },
            Body = body
        };
    }

}
