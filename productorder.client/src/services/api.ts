export interface Product {
    codeProduct: number;
    codeCategory: number;
    categoryDescription: string;
    descriptionProduct: string;
}

export interface OrderItem {
    code_product: string;
    code_category: string;
    descr_product: string;
    quantity: number;
}

export interface Order {
    id: string;
    first_name: string;
    last_name: string;
    address: string;
    mail: string;
    datetime: string;
    items: OrderItem[];
}

export interface CreateOrderRequest {
    first_name: string;
    last_name: string;
    address: string;
    mail: string;
    items: OrderItem[];
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error(`Request failed (${response.status}).`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return response.json() as Promise<T>;
}

async function getJsonWithRetry<T>(url: string): Promise<T> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
            return await getJson<T>(url);
        } catch (error) {
            const status = error instanceof Error
                ? (error as Error & { status?: number }).status
                : undefined;
            const isTransientHttpError = status !== undefined && [502, 503, 504].includes(status);
            const isNetworkError = error instanceof TypeError;

            if ((!isTransientHttpError && !isNetworkError) || attempt === maxAttempts - 1) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
        }
    }

    throw new Error('Unable to load products.');
}

export const getProducts = () => getJsonWithRetry<Product[]>('/api/products');
export const getOrders = () => getJson<Order[]>('/api/orders');

export async function createOrder(order: CreateOrderRequest): Promise<Order> {
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

    if (!response.ok) {
        throw new Error(`Order submission failed (${response.status}).`);
    }

    return response.json() as Promise<Order>;
}
