import type { CartItem } from '../types';

type SelectedProductsProps = {
    cartItems: CartItem[];
};

export default function SelectedProducts({ cartItems }: SelectedProductsProps) {
    const selectedProductsByCategory = [...cartItems.reduce((categories, item) => {
        const { codeCategory, categoryDescription } = item.product;
        const category = categories.get(codeCategory) ?? { code: codeCategory, description: categoryDescription, items: [] as CartItem[] };
        category.items.push(item);
        categories.set(codeCategory, category);
        return categories;
    }, new Map<number, { code: number; description: string; items: CartItem[] }>()).values()];

    return (
        <section className="selected-products-section" aria-labelledby="selected-products-title">
            <div className="section-heading">
                <h2 id="selected-products-title">Selected products</h2>
            </div>
            {selectedProductsByCategory.length === 0 ? (
                <p className="selection-empty-state">Products you add will appear here, grouped by category.</p>
            ) : (
                <div className="selected-products-grid">
                    {selectedProductsByCategory.map((categoryGroup) => (
                        <section className="selected-category" key={categoryGroup.code}>
                            <h3>{categoryGroup.description}</h3>
                            <ul>
                                {categoryGroup.items.map(({ product, quantity }, index) => (
                                    <li key={`${product.codeProduct}-${index}`}><span>{product.descriptionProduct}</span><strong>×{quantity}</strong></li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </section>
    );
}
