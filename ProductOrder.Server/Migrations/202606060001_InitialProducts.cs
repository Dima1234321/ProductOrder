using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductOrder.Server.Migrations;

public partial class InitialProducts : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Categories",
            columns: table => new
            {
                code_category = table.Column<short>(type: "smallint", nullable: false),
                descr_category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Categories", x => x.code_category));

        migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                code_product = table.Column<short>(type: "smallint", nullable: false),
                code_category = table.Column<short>(type: "smallint", nullable: false),
                descr_product = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Products", x => x.code_product);
                table.ForeignKey(
                    name: "FK_Products_Categories_code_category",
                    column: x => x.code_category,
                    principalTable: "Categories",
                    principalColumn: "code_category",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(name: "IX_Products_code_category", table: "Products", column: "code_category");

        migrationBuilder.InsertData(
            table: "Categories",
            columns: new[] { "code_category", "descr_category" },
            values: new object[,]
            {
                { (short)1, "Milk and Cheeses" },
                { (short)2, "Toiletries" },
                { (short)3, "Meat" },
                { (short)4, "Vegetables and Fruits" }
            });

        migrationBuilder.InsertData(
            table: "Products",
            columns: new[] { "code_product", "code_category", "descr_product" },
            values: new object[,]
            {
                { (short)1, (short)1, "Cottage" },
                { (short)2, (short)1, "Milk 3%" },
                { (short)3, (short)1, "Sour cream" },
                { (short)4, (short)2, "Shampoo" },
                { (short)5, (short)2, "Toothpaste" },
                { (short)6, (short)2, "Deodorant" },
                { (short)7, (short)3, "Sausages" },
                { (short)8, (short)3, "Drumsticks" },
                { (short)9, (short)3, "Salmon" },
                { (short)10, (short)4, "Apples" },
                { (short)11, (short)4, "Pears" },
                { (short)12, (short)4, "Onion" }
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Products");
        migrationBuilder.DropTable(name: "Categories");
    }
}
