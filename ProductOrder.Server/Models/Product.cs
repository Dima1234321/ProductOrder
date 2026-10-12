namespace ProductOrder.Server.Models;

public sealed class Product
{
    public short CodeProduct { get; set; }

    public short CodeCategory { get; set; }

    public string DescriptionProduct { get; set; } = string.Empty;
}
