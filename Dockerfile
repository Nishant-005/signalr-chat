# Stage 1: Build the app
FROM FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /app

# Copy the csproj and restore dependencies
COPY SignalRChatServer/*.csproj ./SignalRChatServer/
RUN dotnet restore SignalRChatServer/SignalRChatServer.csproj

# Copy the rest of the project files
COPY SignalRChatServer/ ./SignalRChatServer/

# Publish the project
RUN dotnet publish SignalRChatServer/SignalRChatServer.csproj -c Release -o /app/out

# Stage 2: Create runtime image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime

WORKDIR /app
COPY --from=build /app/out ./

# Expose port (default ASP.NET Core port inside container)
EXPOSE 5000

# Start the application
ENTRYPOINT ["dotnet", "SignalRChatServer.dll"]
