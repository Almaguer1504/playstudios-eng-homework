using MongoDB.Driver;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MongoDBConfig
{
    public class MongoDbClient
    {
        private static readonly string ConnectionString =
            Environment.GetEnvironmentVariable("MONGODB_URI")
            ?? "mongodb://172.17.0.1:27017/";

        private static readonly string DatabaseName =
            Environment.GetEnvironmentVariable("MONGODB_DATABASE")
            ?? "prizesapp";

        private static MongoClient _client = new MongoClient(ConnectionString);

        public static IMongoDatabase Database => _client.GetDatabase(DatabaseName);
    }

    public class Prize
    {
        public MongoDB.Bson.ObjectId id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int Price { get; set; } = 0;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class User
    {
        public MongoDB.Bson.ObjectId id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public bool IsAdmin { get; set; } = false;

        [Required]
        public string Pic { get; set; } =
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"; // Corresponds to 'default'

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool MatchPassword(string enteredPassword)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, this.PasswordHash);
        }

        public void HashPassword(string plaintextPassword)
        {
            this.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plaintextPassword, workFactor: 10);
        }

    }


    public class UserForListing
    {
        public MongoDB.Bson.ObjectId id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        [Required]
        public bool IsAdmin { get; set; } = false;

        [Required]
        public string Pic { get; set; } =
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"; // Corresponds to 'default'

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool MatchPassword(string enteredPassword)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, this.PasswordHash);
        }

        public void HashPassword(string plaintextPassword)
        {
            this.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plaintextPassword, workFactor: 10);
        }

    }

}
