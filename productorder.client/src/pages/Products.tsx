

import { useEffect, useMemo, useState } from 'react';
import { CircleAlert, LoaderCircle, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';
import SelectedProducts from '../components/SelectedProducts';
import type { Product } from '../services/api';
import type { CartItem } from '../types';

type ProductsProps = {
    cartItems: CartItem[];
    onAddProduct: (product: Product, quantity: number) => void;
    onContinue: () => void;
};

export default function Products({ cartItems, onAddProduct, onContinue }: ProductsProps) {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('1');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const categories = useMemo(
        () => [...new Map(products.items.map((product) => [product.codeCategory, product.categoryDescription])).entries()],
        [products.items]
    );
    const categoryProducts = useMemo(
        () => products.items.filter((product) => String(product.codeCategory) === selectedCategory),
        [products.items, selectedCategory]
    );
    const numericQuantity = Number(quantity);
    const canAddProduct = Boolean(selectedProduct)
        && Number.isInteger(numericQuantity)
        && numericQuantity >= 1
        && numericQuantity <= 1000;

    function addProductToCart() {
        const product = categoryProducts.find((item) => String(item.codeProduct) === selectedProduct);
        if (!product || !canAddProduct) return;

        onAddProduct(product, numericQuantity);
        setSelectedProduct('');
        setQuantity('1');
    }

    return (
        <section className="data-panel">
            <div className="panel-heading">
                <h2>Add products</h2>
                <p>Select a category and product, then specify a quantity.</p>
            </div>
            {products.status === 'loading' || products.status === 'idle' ? (
                <div className="state-panel"><LoaderCircle className="spin" size={24} /><span>Loading products…</span></div>
            ) : products.status === 'failed' ? (
                <ErrorState message={products.error ?? 'Unable to load products.'} onRetry={() => dispatch(fetchProducts())} />
            ) : (
                <>
                    <div className="product-selection-row">
                        <label className="selection-field">
                            <span>Category</span>
                            <select name="category" value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSelectedProduct(''); }}>
                                <option value="">Select a category</option>
                                {categories.map(([code, description]) => <option key={code} value={code}>{description}</option>)}
                            </select>
                        </label>
                        <label className="selection-field">
                            <span>Product</span>
                            <select name="product" value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} disabled={!selectedCategory}>
                                <option value="">Select a product</option>
                                {categoryProducts.map((product) => <option key={product.codeProduct} value={product.codeProduct}>{product.descriptionProduct}</option>)}
                            </select>
                        </label>
                        <label className="selection-field quantity-field">
                            <span>Quantity</span>
                            <input
                                name="quantity"
                                type="number"
                                min={1}
                                max={1000}
                                step={1}
                                value={quantity}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (/^\d{0,4}$/.test(value) && (value === '' || Number(value) <= 1000)) setQuantity(value);
                                }}
                                aria-label="Quantity, from 1 to 1,000"
                            />
                        </label>
                        <button className="primary-button add-product-button" type="button" onClick={addProductToCart} disabled={!canAddProduct}>
                            Add product
                        </button>
                    </div>

                    <SelectedProducts cartItems={cartItems} />
                    <div className="continue-order-row">
                        <button className="primary-button" type="button" onClick={onContinue} disabled={cartItems.length === 0}>
                            Continue to Order
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="state-panel error-state" role="alert">
            <CircleAlert size={24} />
            <span>{message}</span>
            <button className="secondary-button" type="button" onClick={onRetry}><RefreshCw size={14} /> Try again</button>
        </div>
    );
}
