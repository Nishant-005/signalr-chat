# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy the csproj and restore dependencies
COPY SignalRChatServer/*.csproj ./SignalRChatServer/
RUN dotnet restore SignalRChatServer/SignalRChatServer.csproj

# Copy the rest of the project files and build
COPY SignalRChatServer/. ./SignalRChatServer/
WORKDIR /app/SignalRChatServer
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SignalRChatServer.dll"]
