USE [PRODUCTS];
GO

SET XACT_ABORT ON;

BEGIN TRY
	BEGIN TRANSACTION;

	IF OBJECT_ID(N'dbo.__EFMigrationsHistory', N'U') IS NULL
	BEGIN
		CREATE TABLE [dbo].[__EFMigrationsHistory]
		(
			[MigrationId] nvarchar(150) NOT NULL,
			[ProductVersion] nvarchar(32) NOT NULL,
			CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
		);
	END;

	IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
	BEGIN
		CREATE TABLE [dbo].[Categories]
		(
			[code_category] smallint NOT NULL,
			[descr_category] nvarchar(50) NOT NULL,
			CONSTRAINT [PK_Categories] PRIMARY KEY ([code_category])
		);
	END;

	IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
	BEGIN
		CREATE TABLE [dbo].[Products]
		(
			[code_product] smallint NOT NULL,
			[code_category] smallint NOT NULL,
			[descr_product] nvarchar(100) NOT NULL,
			CONSTRAINT [PK_Products] PRIMARY KEY ([code_product]),
			CONSTRAINT [FK_Products_Categories_code_category]
				FOREIGN KEY ([code_category])
				REFERENCES [dbo].[Categories] ([code_category])
				ON DELETE NO ACTION
		);
	END;

	IF NOT EXISTS
	(
		SELECT 1
		FROM sys.indexes
		WHERE [name] = N'IX_Products_code_category'
		  AND [object_id] = OBJECT_ID(N'dbo.Products')
	)
	BEGIN
		CREATE INDEX [IX_Products_code_category]
			ON [dbo].[Products] ([code_category]);
	END;

	INSERT INTO [dbo].[Categories] ([code_category], [descr_category])
	SELECT seed.[code_category], seed.[descr_category]
	FROM (VALUES
		(CONVERT(smallint, 1), N'Milk and Cheeses'),
		(CONVERT(smallint, 2), N'Toiletries'),
		(CONVERT(smallint, 3), N'Meat'),
		(CONVERT(smallint, 4), N'Vegetables and Fruits')
	) AS seed ([code_category], [descr_category])
	WHERE NOT EXISTS
	(
		SELECT 1
		FROM [dbo].[Categories] AS category
		WHERE category.[code_category] = seed.[code_category]
	);

	INSERT INTO [dbo].[Products] ([code_product], [code_category], [descr_product])
	SELECT seed.[code_product], seed.[code_category], seed.[descr_product]
	FROM (VALUES
		(CONVERT(smallint, 1), CONVERT(smallint, 1), N'Cottage'),
		(CONVERT(smallint, 2), CONVERT(smallint, 1), N'Milk 3%'),
		(CONVERT(smallint, 3), CONVERT(smallint, 1), N'Sour cream'),
		(CONVERT(smallint, 4), CONVERT(smallint, 2), N'Shampoo'),
		(CONVERT(smallint, 5), CONVERT(smallint, 2), N'Toothpaste'),
		(CONVERT(smallint, 6), CONVERT(smallint, 2), N'Deodorant'),
		(CONVERT(smallint, 7), CONVERT(smallint, 3), N'Sausages'),
		(CONVERT(smallint, 8), CONVERT(smallint, 3), N'Drumsticks'),
		(CONVERT(smallint, 9), CONVERT(smallint, 3), N'Salmon'),
		(CONVERT(smallint, 10), CONVERT(smallint, 4), N'Apples'),
		(CONVERT(smallint, 11), CONVERT(smallint, 4), N'Pears'),
		(CONVERT(smallint, 12), CONVERT(smallint, 4), N'Onion')
	) AS seed ([code_product], [code_category], [descr_product])
	WHERE NOT EXISTS
	(
		SELECT 1
		FROM [dbo].[Products] AS product
		WHERE product.[code_product] = seed.[code_product]
	);

	IF NOT EXISTS
	(
		SELECT 1
		FROM [dbo].[__EFMigrationsHistory]
		WHERE [MigrationId] = N'202606060001_InitialProducts'
	)
	BEGIN
		INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
		VALUES (N'202606060001_InitialProducts', N'10.0.12');
	END;

	COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION;

	THROW;
END CATCH;
