import React, { useEffect, useState } from "react";
import "../../cartsidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(cart);
        };

        fetchCartItems();
    }, [isOpen]);

    const handleRemoveItem = (id, type, color) => {
        const updatedCart = cartItems.filter(
            (item) => !(item.id === id && item.type === type && item.color === color)
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        document.dispatchEvent(new Event("cartUpdated"));
    };

    // Tính tổng số tiền
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <>
            {/* Overlay */}
            <div
                className={`overlay ${isOpen ? "active" : ""}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
                <div className="cart-header">
                    <h2 >Giỏ Hàng</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="cart-content1">
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <h4>{item.name} - {item.type} - {item.color}</h4>
                                    <p>Số lượng ngày: {item.quantity}</p>
                                    <p>Giá: ${item.price}</p>
                                </div>
                                <button
                                    className="remove-icon"
                                    onClick={() => handleRemoveItem(item.id, item.type, item.color)}
                                >
                                    &times;
                                </button>
                                <br />
                            </div>
                        ))
                    ) : (
                        <p>Giỏ hàng của bạn đang trống.</p>
                    )}
                </div>
                {/* Tổng số tiền */}
                <div className="total-price-container">
                        <span className="total-price-label">Tổng số tiền:</span>
                        <span className="total-price-value">${totalPrice.toFixed(2)}</span>
                    </div>
                <div className="cart-footer">
                    {/* Nút điều hướng */}
                    <a href="/Cart" className="action-button">Chi Tiết</a>
                </div>

            </div>
        </>
    );
};

export default CartSidebar;
