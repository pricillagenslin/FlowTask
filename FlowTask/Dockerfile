FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["FlowTask.csproj", "."]

RUN dotnet restore "FlowTask.csproj"

COPY . .

RUN dotnet publish "FlowTask.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "FlowTask.dll"]
