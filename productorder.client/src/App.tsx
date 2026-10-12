import { useState } from 'react';
import type { Product } from './services/api';
import type { CartItem } from './types';
import Order from './pages/Order';
import Products from './pages/Products';
import './App.css';

type Page = 'products' | 'order';

function App() {
    const [page, setPage] = useState<Page>('products');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    function addProductToCart(product: Product, quantity: number) {
        setCartItems((items) => {
            const existingItem = items.find((item) => item.product.codeProduct === product.codeProduct);
            if (!existingItem) return [...items, { product, quantity }];

            return items.map((item) => item.product.codeProduct === product.codeProduct
                ? { ...item, quantity: item.quantity + quantity }
                : item);
        });
    }

    function startNewOrder() {
        setCartItems([]);
        setPage('products');
    }

    return (
        <main className="app-shell">
            <header className="app-header">
                <button className="brand" type="button" onClick={() => setPage('products')} aria-label="Product Order home">
                    product<span>order</span>
                </button>
                <span className="step-indicator">{page === 'products' ? 'Step 1 of 2' : 'Step 2 of 2'}</span>
            </header>

            <div className="content-wrap">
                <div className="page-heading">
                    <div className="eyebrow">{page === 'products' ? 'CREATE AN ORDER' : 'ORDER DETAILS'}</div>
                    <h1>{page === 'products' ? 'Select Products' : 'Order'}</h1>
                    <p>{page === 'products' ? 'Choose products and quantities for your order.' : 'Enter your details to complete your order.'}</p>
                </div>

                {page === 'products' ? (
                    <Products
                        cartItems={cartItems}
                        onAddProduct={addProductToCart}
                        onContinue={() => setPage('order')}
                    />
                ) : (
                    <Order
                        cartItems={cartItems}
                        onReturnToProducts={() => setPage('products')}
                        onStartNewOrder={startNewOrder}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
