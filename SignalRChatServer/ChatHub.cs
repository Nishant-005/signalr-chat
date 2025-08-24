using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using SignalRChatServer.Data;
using SignalRChatServer.Models;

public class ChatHub : Hub
{
    private readonly ChatDbContext _context;

    public ChatHub(ChatDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(string user, string message)
    {

        var chatMessage = new ChatMessage
        {
            Username = user,
            Content = message,
            Timestamp = DateTime.UtcNow
        };

        _context.Messages.Add(chatMessage);
        await _context.SaveChangesAsync();



        Console.WriteLine($"[{DateTime.Now}] {user}: {message}");
        await Clients.All.SendAsync("ReceiveMessage",user, message);
    }
}