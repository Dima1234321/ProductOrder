# ProductOrder

ProductOrder is a local development application with a React/TypeScript client, a .NET 10 Products API backed by SQL Server, and a separate NestJS Orders API backed by Elasticsearch.

## Prerequisites

- .NET 10 SDK and the `dotnet-ef` tool
- Node.js 20.11 or later and npm
- Docker Desktop (for the local Elasticsearch service)
- SQL Server Express running on `DESKTOP-K7P8UDN\SQLEXPRESS`, or a configured SQL Server connection

The .NET connection string is in `ProductOrder.Server/appsettings.json`; override it with `ConnectionStrings__Products` when needed.

## Start the application

1. Start Elasticsearch. The development Compose service persists its data in a named volume and disables Elasticsearch security; do not expose it to untrusted networks.

   ```powershell
   cd ProductOrder.OrdersServer
   docker compose up -d
   Copy-Item .env.example .env
   npm install
   ```

   The Orders API defaults to `http://localhost:3001` and creates the lowercase `orders` index from `orders.mapping.json` at startup. Configure `ELASTICSEARCH_URL`, `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD`, or `ELASTICSEARCH_INDEX` in `.env` for another cluster. Provide both username and password when connecting to a secured cluster. The requested mapping has one replica; a single-node local cluster can therefore report yellow health while remaining usable.

2. Install client dependencies:

   ```powershell
   cd ..\productorder.client
   npm install
   ```

3. In Visual Studio, set `ProductOrder.Server` as the startup project and start it with the `https` profile. The SPA's Vite development command also starts the NestJS Orders API. Alternatively, start the .NET API from a separate terminal at the repository root:

   ```powershell
   dotnet run --project ProductOrder.Server
   ```

   On first startup, EF Core applies the checked-in migration, creates the `PRODUCTS` database when the SQL login has database-creation permissions, and inserts sample categories and products. The API is available at `http://localhost:5268/api/products`; the SPA is available at `https://localhost:52579`.

The Vite development proxy routes `/api/products` to the .NET API and `/api/orders` to `http://localhost:3001`. Set `ORDERS_API_URL` to change the Orders API address. The client checkout form submits customer details and cart items to `POST /api/orders`; saved documents appear on the Orders page. `GET /api/orders` returns the latest documents, and `GET /health` is the Orders API liveness endpoint.

Example order request:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "address": "123 Main Street, Apt 4B, New York, NY",
  "mail": "jane.doe@example.com",
  "items": [
    {
      "code_product": "PROD-001",
      "code_category": "CAT-TECH",
      "descr_product": "Wireless Mechanical Keyboard",
      "quantity": 1
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