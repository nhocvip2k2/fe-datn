import React, { useState, useEffect } from "react";
import "../../cart.css"; // Import CSS từ file riêng
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = quantity > 0 ? quantity : 1;
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        // Gửi sự kiện "cartUpdated" để thông báo các component khác
        document.dispatchEvent(new Event("cartUpdated"));
    };
    const navigate = useNavigate(); // Khởi tạo hàm điều hướng
    const handleCheckout = () => {
        navigate("/Checkout"); // Dẫn đến trang thanh toán
    };
    
    return (
        <>
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                {cartItems.length > 0 ? (
                    <div className="cart-content">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="product-info">
                                            <img src={item.image} alt={item.name} className="product-image-cart" />
                                            <span>{item.name}</span>
                                        </td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleRemoveItem(index)}>X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-summary">
                            <h3>Cart Totals</h3>
                            <div className="summary-details">
                                <p>
                                    <span>Subtotal:</span> <span className="price">${totalPrice.toFixed(2)}</span>
                                </p>
                                <div className="shipping-info">
                                    <p>
                                        <span>Shipping:</span>
                                        <div className="shipping-details">
                                            <p><span>FreeShip</span></p> {/* Giả sử miễn phí vận chuyển */}
                                            <p><span>Shipping to Nam Định</span></p> {/* Địa chỉ vận chuyển */}
                                            <p><span>Change Address</span></p> {/* Thay đổi địa chỉ */}
                                        </div>
                                    </p>
                                </div>

                                <p className="total">
                                    <span>Total:</span> <span className="price">${(totalPrice + 5 + 1.5).toFixed(2)}</span> {/* Tổng cộng bao gồm Subtotal, Shipping và Tax */}
                                </p>
                            </div>

                            <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
                        </div>
                    </div>
                ) : (
                    <p className="empty-cart">Your cart is currently empty.</p>
                )}
            </div>
        </>
    );
};

export default Cart;
