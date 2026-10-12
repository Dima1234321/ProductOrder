using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ProductOrder.Server.Data;

#nullable disable

namespace ProductOrder.Server.Migrations;

[DbContext(typeof(ProductsDbContext))]
[Migration("202606060001_InitialProducts")]
public partial class InitialProducts
{
}
