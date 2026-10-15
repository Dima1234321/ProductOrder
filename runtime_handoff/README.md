# ProductOrder runtime handoff (Linux/amd64)

This package runs the ProductOrder development/test stack without the source repository. It contains prebuilt application images and an image-only Compose file. SQL Server and Elasticsearch images are downloaded from their registries, so the destination computer needs internet access.

## Requirements

- Docker Desktop with Linux containers on Windows x64, or Docker Engine on Linux x64
- Internet access to pull SQL Server and Elasticsearch images
- Sufficient memory for SQL Server and Elasticsearch

The SQL Server 2022 Linux container requires `linux/amd64`. ARM64 is not supported by this package. SQL Server Developer edition is for development and testing only; do not use this package for production.

## Start

1. Load the ProductOrder application images:

   ```powershell
   docker load --input productorder-runtime-images-linux-amd64.tar
   ```

2. Create the local settings file and replace the sample SQL Server password:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

3. Pull the SQL Server and Elasticsearch dependencies and start the app:

   ```powershell
   docker compose pull sqlserver elasticsearch
   docker compose up -d
   docker compose ps
   ```

4. Open `http://localhost:52579`.

The web client proxies `/api/products` and `/api/orders` to the backend containers. Only the client port is published on localhost; the APIs, SQL Server, and Elasticsearch stay on the Compose network. The Products API applies its EF Core migration at startup, and the Orders API creates its Elasticsearch index from the bundled mapping.

#### In the source-free runtime Compose file, Elasticsearch’s port isn’t published to the host, so localhost:9200 won’t reach it. From the package folder, query it inside the Elasticsearch container:
```powershell
docker compose exec elasticsearch curl -sS "http://localhost:9200/orders/_search?pretty=true&size=10000"
```

## Logs and shutdown

```powershell
docker compose logs -f
docker compose down
```

`docker compose down` preserves SQL Server and Elasticsearch data in named volumes. To delete that data as well, run `docker compose down --volumes`.

## Source and security notes

The handoff archive contains runtime images, not the C#, TypeScript, or project source files. The frontend must deliver JavaScript to the browser, so users can inspect the built client assets. The development/test configuration uses SQL Server Developer edition and Elasticsearch with security disabled; Elasticsearch is not published outside the internal Compose network. Do not expose the stack to an untrusted network or use it as a production deployment.
