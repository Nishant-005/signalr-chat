using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using SignalRChatServer.Data;
using System;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with MySQL
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(9, 4, 0))
    ));

// Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapHub<ChatHub>("/chatHub");

app.MapGet("/messages", async (ChatDbContext db) =>
    await db.Messages.ToListAsync());

// ===== CROSS-PLATFORM SIMULATED METRICS =====
double GetCpuUsage() => new Random().Next(5, 80);
(double totalRam, double availableRam) GetRamInfo() => (16000, new Random().Next(4000, 14000));
(double totalDisk, double usedDisk) GetDiskUsage() => (500, new Random().Next(100, 400));
string GetUptime() => TimeSpan.FromMilliseconds(Environment.TickCount64).ToString(@"dd\.hh\:mm\:ss");

// ===== SERVER STATUS ENDPOINT =====
app.MapGet("/server-status", () =>
{
    var cpu = GetCpuUsage();
    var (totalRam, availableRam) = GetRamInfo();
    var ramUsedPercent = ((totalRam - availableRam) / totalRam) * 100;
    var (totalDisk, usedDisk) = GetDiskUsage();
    var diskUsedPercent = (usedDisk / totalDisk) * 100;

    var network = new { In = new Random().Next(100, 1000), Out = new Random().Next(50, 500) };

    var topProcesses = Enumerable.Range(1, 5).Select(i => new
    {
        ProcessName = "Process" + i,
        CPU = Math.Round(cpu / 5, 1),
        RAM = new Random().Next(100, 1000)
    }).ToList();

    return Results.Json(new
    {
        cpuUsage = cpu,
        ramAvailable = availableRam,
        totalRam,
        ramUsedPercent,
        cpuCores = Environment.ProcessorCount,
        uptime = GetUptime(),
        diskUsedPercent,
        network,
        topProcesses
    });
});

app.Run();
