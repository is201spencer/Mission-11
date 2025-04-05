import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../style/cart.css";

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, clearCart } = useCart();

    const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);

    return (
        <div className="cart-container">
            <h2>Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.bookId}>
                                    <td data-label="Title">{item.title}</td>
                                    <td data-label="Quantity">{item.quantity}</td>
                                    <td data-label="Price">${item.price.toFixed(2)}</td>
                                    <td data-label="Subtotal">${item.subtotal.toFixed(2)}</td>
                                    <td data-label="Action">
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.bookId)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="cart-total">
                        Total: ${totalPrice}
                    </div>

                    <div className="cart-buttons">
                        <button className="clear-cart" onClick={clearCart}>
                            Clear Cart
                        </button>

                        <button className="checkout">
                            Checkout
                        </button>

                        <button className="continue-shopping" onClick={() => navigate(-1)}>
                            Continue Shopping
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
