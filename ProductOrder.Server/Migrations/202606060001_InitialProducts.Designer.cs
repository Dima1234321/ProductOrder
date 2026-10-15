using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ProductOrder.Server.Data;
using ProductOrder.Server.Models;

#nullable disable

namespace ProductOrder.Server.Migrations;

[DbContext(typeof(ProductsDbContext))]
[Migration("202606060001_InitialProducts")]
public partial class InitialProducts
{
    protected override void BuildTargetModel(ModelBuilder modelBuilder)
    {
        modelBuilder.HasAnnotation("ProductVersion", "10.0.12");

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(category => category.CodeCategory);
            entity.Property(category => category.CodeCategory)
                .HasColumnName("code_category")
                .HasColumnType("smallint")
                .ValueGeneratedNever();
            entity.Property(category => category.DescriptionCategory)
                .HasColumnName("descr_category")
                .HasMaxLength(50)
                .IsRequired();
            entity.HasData(
                new Category { CodeCategory = 1, DescriptionCategory = "Milk and Cheeses" },
                new Category { CodeCategory = 2, DescriptionCategory = "Toiletries" },
                new Category { CodeCategory = 3, DescriptionCategory = "Meat" },
                new Category { CodeCategory = 4, DescriptionCategory = "Vegetables and Fruits" });
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(product => product.CodeProduct);
            entity.Property(product => product.CodeProduct)
                .HasColumnName("code_product")
                .HasColumnType("smallint")
                .ValueGeneratedNever();
            entity.Property(product => product.CodeCategory)
                .HasColumnName("code_category")
                .HasColumnType("smallint");
            entity.Property(product => product.DescriptionProduct)
                .HasColumnName("descr_product")
                .HasMaxLength(100)
                .IsRequired();
            entity.HasIndex(product => product.CodeCategory);
            entity.HasOne<Category>()
                .WithMany()
                .HasForeignKey(product => product.CodeCategory)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasData(
                new Product { CodeProduct = 1, CodeCategory = 1, DescriptionProduct = "Cottage" },
                new Product { CodeProduct = 2, CodeCategory = 1, DescriptionProduct = "Milk 3%" },
                new Product { CodeProduct = 3, CodeCategory = 1, DescriptionProduct = "Sour cream" },
                new Product { CodeProduct = 4, CodeCategory = 2, DescriptionProduct = "Shampoo" },
                new Product { CodeProduct = 5, CodeCategory = 2, DescriptionProduct = "Toothpaste" },
                new Product { CodeProduct = 6, CodeCategory = 2, DescriptionProduct = "Deodorant" },
                new Product { CodeProduct = 7, CodeCategory = 3, DescriptionProduct = "Sausages" },
                new Product { CodeProduct = 8, CodeCategory = 3, DescriptionProduct = "Drumsticks" },
                new Product { CodeProduct = 9, CodeCategory = 3, DescriptionProduct = "Salmon" },
                new Product { CodeProduct = 10, CodeCategory = 4, DescriptionProduct = "Apples" },
                new Product { CodeProduct = 11, CodeCategory = 4, DescriptionProduct = "Pears" },
                new Product { CodeProduct = 12, CodeCategory = 4, DescriptionProduct = "Onion" });
        });
    }
}
