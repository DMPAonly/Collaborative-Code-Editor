# Step 1: Use the SDK image to build and publish the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["Execution-Service.csproj", "./"]
RUN dotnet restore "Execution-Service.csproj"

# Copy remaining source code and publish in Release mode
COPY . .
RUN dotnet publish "Execution-Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Step 2: Use the ASP.NET runtime image to run the published app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render dynamically sets a PORT environment variable (defaults to 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Execution-Service.dll"]