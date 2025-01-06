import React, { useState, useEffect } from "react";
import "../../cart.css"; // Import CSS từ file riêng
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDeposit, setTotalDeposit] = useState(0); // Tổng tiền cọc

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
        calculateTotals(storedCart);
    }, []);

    const calculateTotals = (items) => {
        const total = items.reduce(
            (acc, item) => acc + item.price * item.quantity * item.rentalDays,
            0
        );
        const deposit = items.reduce((acc, item) => acc + item.deposit * item.quantity, 0);
        setTotalPrice(total);
        setTotalDeposit(deposit);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = quantity > 0 ? quantity : 1;
        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleRentalDaysChange = (index, rentalDays) => {
        const updatedCart = [...cartItems];
        updatedCart[index].rentalDays = rentalDays > 0 ? rentalDays : 1;
        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        calculateTotals(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        document.dispatchEvent(new Event("cartUpdated"));
    };

    const navigate = useNavigate();
    const handleCheckout = () => {
        navigate("/Checkout");
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
                                    <th>Sản phẩm</th>
                                    <th>Giá thuê</th>
                                    <th>Số lượng</th>
                                    <th>Số ngày</th>
                                    <th>Tiền cọc</th> {/* Cột Tiền cọc */}
                                    <th>Tiền thuê</th>
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
                                        <td>{item.price.toFixed(0)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={item.rentalDays}
                                                min="1"
                                                onChange={(e) => handleRentalDaysChange(index, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            {(
                                                item.deposit
                                            ).toFixed(0)} x {(
                                                item.rentalDays
                                            ).toFixed(0)}
                                        </td>
                                        <td>
                                            
                                            {(
                                                item.price *
                                                item.quantity *
                                                item.rentalDays
                                            ).toFixed(0)}
                                        </td>
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
                                    <span>Tiền thuê:</span> <span className="price">{totalPrice.toLocaleString()}</span>
                                </p>
                                <p>
                                    <span>Tiền Cọc:</span> <span className="price">{totalDeposit.toLocaleString()}</span>
                                </p>
                                <p className="total">
                                    <span>Tổng:</span>{" "}
                                    <span className="price">
                                        {(totalPrice + totalDeposit).toLocaleString()}
                                    </span>
                                </p>
                            </div>

                            <button className="checkout-button" onClick={handleCheckout}>
                                Tiến hành thanh toán
                            </button>
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
