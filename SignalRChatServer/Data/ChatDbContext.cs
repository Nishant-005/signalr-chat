using Microsoft.EntityFrameworkCore;
using SignalRChatServer.Models;

namespace SignalRChatServer.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

        public DbSet<ChatMessage> Messages { get; set; }
    }
}