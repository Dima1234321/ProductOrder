import { useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { createOrder } from '../services/api';
import type { CartItem } from '../types';

type OrderProps = {
    cartItems: CartItem[];
    onReturnToProducts: () => void;
    onStartNewOrder: () => void;
};

export default function Order({ cartItems, onReturnToProducts, onStartNewOrder }: OrderProps) {
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', address: '', mail: '' });
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [orderSubmissionError, setOrderSubmissionError] = useState<string | null>(null);
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmittingOrder(true);
        setOrderSubmissionError(null);

        try {
            await createOrder({
                first_name: customer.firstName.trim(),
                last_name: customer.lastName.trim(),
                address: customer.address.trim(),
                mail: customer.mail.trim(),
                items: cartItems.map(({ product, quantity }) => ({
                    code_product: String(product.codeProduct),
                    code_category: String(product.codeCategory),
                    descr_product: product.descriptionProduct,
                    quantity
                }))
            });
            setOrderSubmitted(true);
        } catch (error) {
            setOrderSubmissionError(error instanceof Error ? error.message : 'Unable to submit this order.');
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    return (
        <section className="data-panel order-panel">
            <div className="panel-heading">
                <h2>Customer details</h2>
                <p>{orderSubmitted ? 'Your order has been submitted.' : `Your order contains ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}.`}</p>
            </div>
            {orderSubmitted ? (
                <div className="order-success" role="status">
                    <h2>Order placed</h2>
                    <p>Your order has been submitted successfully.</p>
                    <button className="primary-button" type="button" onClick={onStartNewOrder}>Start another order</button>
                </div>
            ) : (
                <>
                    {orderSubmissionError && <div className="checkout-error" role="alert">{orderSubmissionError}</div>}
                    <form className="checkout-form" onSubmit={submitOrder}>
                        <label className="selection-field"><span>First name</span><input required maxLength={128} autoComplete="given-name" value={customer.firstName} onChange={(event) => setCustomer({ ...customer, firstName: event.target.value })} /></label>
                        <label className="selection-field"><span>Last name</span><input required maxLength={128} autoComplete="family-name" value={customer.lastName} onChange={(event) => setCustomer({ ...customer, lastName: event.target.value })} /></label>
                        <label className="selection-field"><span>Email</span><input required type="email" maxLength={254} autoComplete="email" value={customer.mail} onChange={(event) => setCustomer({ ...customer, mail: event.target.value })} /></label>
                        <label className="selection-field checkout-address"><span>Address</span><input required maxLength={500} autoComplete="street-address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} /></label>
                        <div className="checkout-actions">
                            <button className="back-button" type="button" onClick={onReturnToProducts} disabled={isSubmittingOrder}>Return to Products</button>
                            <button className="primary-button" type="submit" disabled={isSubmittingOrder || cartItems.length === 0}>
                                {isSubmittingOrder ? <><LoaderCircle size={15} className="spin" /> Submitting…</> : 'Place order'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </section>
    );
}
