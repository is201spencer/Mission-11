import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, clearCart } = useCart();

    const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);

    return (
        <div className="container mt-4">
            <h2>Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table className="table">
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
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${item.subtotal.toFixed(2)}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.bookId)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3>Total: ${totalPrice}</h3>

            {cart.length > 0 && (
                <button className="btn btn-warning me-2" onClick={clearCart}>
                    Clear Cart
                </button>
            )}

            <button className="btn btn-success me-2">Checkout</button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Continue Shopping
            </button>
        </div>
    );
}

export default CartPage;
