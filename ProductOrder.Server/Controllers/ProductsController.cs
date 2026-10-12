using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductOrder.Server.Data;

namespace ProductOrder.Server.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(ProductsDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductListItem>>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await (
            from product in db.Products.AsNoTracking()
            join category in db.Categories.AsNoTracking()
                on product.CodeCategory equals category.CodeCategory
            orderby product.CodeProduct
            select new ProductListItem(
                product.CodeProduct,
                product.CodeCategory,
                category.DescriptionCategory,
                product.DescriptionProduct))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }
}

public sealed record ProductListItem(
    short CodeProduct,
    short CodeCategory,
    string CategoryDescription,
    string DescriptionProduct);
