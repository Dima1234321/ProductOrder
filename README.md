# ProductOrder

ProductOrder is a local development application with a React/TypeScript client, a .NET 10 Products API backed by SQL Server, and a separate NestJS Orders API backed by Elasticsearch.


## Run the whole solution with Docker Compose

Prerequisite: Docker Desktop configured to use Linux containers. From the repository root, create a local environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace the sample `MSSQL_SA_PASSWORD` with a unique strong password. Then build and start the complete stack:

```powershell
docker compose up --build
```

Open the client at `http://localhost:52579`. The Products API is available at `http://localhost:5268/api/products`, the Orders API at `http://localhost:3001`, Elasticsearch at `http://localhost:9200`, and SQL Server at `localhost:1433`. The APIs wait for their database/search dependencies to become healthy; the Products API applies its EF Core migration on startup.

All published ports bind to `127.0.0.1`. The local Elasticsearch service has security disabled, so do not change these bindings or expose it to an untrusted network. SQL Server uses the Developer edition, intended only for development and testing. SQL Server and Elasticsearch data persist in named Docker volumes when containers stop.

Useful commands from the repository root:

```powershell
docker compose logs -f
docker compose down
```

`docker compose down` removes the containers but preserves database/search data. To also delete that data, run `docker compose down --volumes`.

Ports and image settings can be overridden in `.env`; see `.env.example`. The local `.env` is ignored by Git. The Vite development proxy routes `/api/products` to the .NET API and `/api/orders` to the Orders API. The client checkout form submits customer details and cart items to `POST /api/orders`; saved documents appear on the Orders page. `GET /api/orders` returns the latest documents, and `GET /health` is the Orders API liveness endpoint.

## Run services manually

The Elasticsearch-only Compose setup remains available if you prefer to run the APIs and client outside Docker. From the repository root:

```powershell
docker compose -f ProductOrder.OrdersServer/docker-compose.yml up -d
Copy-Item ProductOrder.OrdersServer/.env.example ProductOrder.OrdersServer/.env
```

Install Node dependencies in `ProductOrder.OrdersServer` and `productorder.client`, then run the NestJS API and Vite client using their npm scripts. Run the .NET API with `dotnet run --project ProductOrder.Server` or start it from Visual Studio using the `https` profile. Configure SQL Server with `ConnectionStrings__Products` if the default local connection in `ProductOrder.Server/appsettings.json` does not apply. In host-based development, the SPA is available at `https://localhost:52579` and the .NET API at `http://localhost:5268`.

When using a secured external Elasticsearch cluster, set `ELASTICSEARCH_URL`, `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD`, or `ELASTICSEARCH_INDEX` in `ProductOrder.OrdersServer/.env`. Provide both username and password when connecting to a secured cluster. The requested mapping has one replica; a single-node local cluster can therefore report yellow health while remaining usable.

Example order request:

```json
 {
  "first_name" : "Moshe",
  "last_name" : "Israel",
  "address" : "Kikar ha-Medina 1",
  "mail" : "mail@gmail.com",
  "datetime" : "2026-10-12T19:08:16.802Z",
  "items" : [
    {
      "code_product" : "2",
      "code_category" : "1",
      "descr_product" : "Milk 3%",
      "quantity" : 3
    },
    {
      "code_product" : "12",
      "code_category" : "4",
      "descr_product" : "Onion",
      "quantity" : 4
    }
  ]
}
```

The API assigns `datetime` in UTC when an order is saved. The Elasticsearch mapping is defined in `ProductOrder.OrdersServer/orders.mapping.json` and uses snake_case field names with nested order items.

## Database migrations

The initial migration is checked in and applied automatically by the .NET app at startup. To scaffold additional schema changes after updating the EF model, run:

```powershell
dotnet ef migrations add <MigrationName> --project ProductOrder.Server
dotnet ef database update --project ProductOrder.Server
```

## Client checks

```powershell
cd productorder.client
npm install
npm run build
npm run lint
```

## Orders API checks

```powershell
cd ProductOrder.OrdersServer
npm install
npm run build