# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy project file(s) and restore dependencies
# Adjust the path if your .csproj is in a subfolder
COPY SignalRChatServer/*.csproj ./SignalRChatServer/
RUN dotnet restore ./SignalRChatServer/*.csproj

# Copy the rest of the files
COPY SignalRChatServer/. ./SignalRChatServer/
WORKDIR /app/SignalRChatServer

# Publish the project to /app/publish
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Set the entrypoint
ENTRYPOINT ["dotnet", "SignalRChatServer.dll"]
