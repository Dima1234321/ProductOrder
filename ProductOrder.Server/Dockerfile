# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# For more information, please see https://aka.ms/containercompat

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM node:22-bookworm-slim AS node

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
COPY --from=node /usr/local/ /usr/local/
WORKDIR /src
COPY ProductOrder.Server/ProductOrder.Server.csproj ProductOrder.Server/
COPY productorder.client/productorder.client.esproj productorder.client/
RUN dotnet restore ProductOrder.Server/ProductOrder.Server.csproj
COPY . .
RUN dotnet publish ProductOrder.Server/ProductOrder.Server.csproj \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false \
    /p:ShouldRunBuildScript=false

FROM runtime AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProductOrder.Server.dll"]
