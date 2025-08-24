using System;

namespace SignalRChatServer.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Content { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

}