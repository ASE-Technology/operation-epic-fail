#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["file-service/file-service/file-service.csproj", "file-service/file-service/"]
COPY ["file-service/file-service.DAL/file-service.DAL.csproj", "file-service/file-service.DAL/"]
RUN dotnet restore "file-service/file-service/file-service.csproj"
COPY . .
WORKDIR "/src/file-service/file-service"
RUN dotnet build "file-service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "file-service.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "file-service.dll"]