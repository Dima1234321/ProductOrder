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

        if (response.status === 400) {
            let messages: string[] = [];

            try {
                const body = await response.json() as { message?: unknown };
                if (Array.isArray(body.message)) {
                    messages = body.message.filter((message): message is string =>
                        typeof message === 'string'
                    );
                } else if (typeof body.message === 'string') {
                    messages = [body.message];
                }
            } catch {
                // Use the friendly fallback if the response isn't JSON.
            }

            if (messages.some((message) => /\b(mail|email)\b/i.test(message))) {
                throw new Error(
                    'Please enter a complete email address, including a domain extension (for example, name@example.com).'
                );
            }

            throw new Error(
                'Some order details are invalid. Please review the information and try again.'
            );
        }

        //throw new Error('We couldn’t submit your order right now. Please try again.');

        throw new Error(`Order submission failed (${response.status}).`);
    }

    return response.json() as Promise<Order>;
}
