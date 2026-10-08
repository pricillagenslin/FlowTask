# ---------- Stage 1: build frontend + backend ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Install Node.js (for building the React app)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# 1. Build the React frontend first
COPY flowtask-frontend/ ./flowtask-frontend/
RUN cd flowtask-frontend \
    && npm install \
    && npm run build

# 2. Restore + build the backend
COPY FlowTask/ ./FlowTask/
RUN dotnet restore "FlowTask/FlowTask.csproj"

WORKDIR /src/FlowTask
RUN dotnet publish "FlowTask.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ---------- Stage 2: runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app
COPY --from=build /app/publish .

# Render uses port 8080 by default; make sure ASP.NET listens on it
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FlowTask.dll"]