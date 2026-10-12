import type { Product } from './services/api';

export type CartItem = {
    product: Product;
    quantity: number;
};
