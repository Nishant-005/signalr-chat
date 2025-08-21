using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Microsoft.AspNetCore.SignalR.Client;

namespace SignalRChatClient
{
    public partial class MainWindow : Window
    {

        private HubConnection? _connection;
        private string _username = "";

        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Connect_Click(object sender, RoutedEventArgs e)
        {
            _username=UserNameBox.Text;

            _connection=new HubConnectionBuilder()
                .WithUrl("http://localhost:5277/chatHub")
                .WithAutomaticReconnect()
                .Build();

            _connection.On<string, string>("ReceiveMessage", (user, message) =>
            {
                Dispatcher.Invoke(() =>
                {
                    MessageList.Items.Add($"{user}: {message}");
                });
            });

            try
            {
                await _connection.StartAsync();
                MessageList.Items.Add("Connected to chat server. ");
            }
            catch (Exception ex) 
            {
                MessageList.Items.Add($"Connection error: {ex.Message}");
            }
        }

        private async void Send_Click(object sender, RoutedEventArgs e)
        {
            if (_connection is not null && !string.IsNullOrEmpty(MessageTextBox.Text))
            {
                await _connection.InvokeAsync("SendMessage", _username, MessageTextBox.Text);
                MessageTextBox.Clear();
            }
        }
    }
}