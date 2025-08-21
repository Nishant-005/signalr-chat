using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        Console.WriteLine($"[{DateTime.Now}] {user}: {message}");
        await Clients.All.SendAsync("ReceiveMessage",user, message);
    }
}