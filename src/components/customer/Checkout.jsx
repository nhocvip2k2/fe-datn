import React, { useEffect, useState } from "react";
import "../../checkout.css"; // Import CSS
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cartItems, setCartItems] = useState([]);

  // Lấy dữ liệu giỏ hàng từ localStorage khi component được load
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  // Hàm fetch gợi ý địa chỉ từ API
  const fetchSuggestions = async (input) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        input
      )}&format=json&addressdetails=1&countrycodes=VN`
    );
    const data = await response.json();
    setSuggestions(
      data.map((item) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))
    );
  };

  // Sử dụng useEffect để tự động fetch gợi ý mỗi 5 giây nếu địa chỉ có trên 2 ký tự
  useEffect(() => {
    const interval = setInterval(() => {
      if (address.length > 2) {
        fetchSuggestions(address);
      } else {
        setSuggestions([]);
      }
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, [address]);

  // Xử lý gợi ý địa chỉ
  const handleAddressInput = (e) => {
    setAddress(e.target.value);
  };

  // Chọn một gợi ý
  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.display_name);
    setSuggestions([]); // Ẩn gợi ý sau khi chọn
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    navigate("/PaymentQR"); // Dẫn đến trang thanh toán
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      <Header />
      <div className="checkout-container">
        <h2>Thanh toán</h2>
        <form onSubmit={handleCheckout} className="checkout-form">
          <div className="checkout-row">
            {/* Thông tin khách hàng */}
            <div className="checkout-column customer-info">
              <div className="section">
                <h3>Thông tin khách hàng</h3>
                <div className="input-group">
                  <label>Họ và tên:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="input-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Nhập email"
                  />
                </div>
                <div className="input-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="input-group">
                  <label>Địa chỉ giao hàng:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressInput}
                    required
                    placeholder="Nhập địa chỉ giao hàng"
                  />
                  {/* Gợi ý địa chỉ */}
                  {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          {suggestion.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Giỏ hàng */}
            <div className="checkout-column cart-info">
              <div className="section">
                <h3>Giỏ hàng</h3>
                <ul className="cart-items">
                  {cartItems.length === 0 ? (
                    <li>Giỏ hàng của bạn hiện tại đang trống</li>
                  ) : (
                    cartItems.map((item) => (
                      <li key={item.id}>
                        <span>
                          {item.name}-{item.type}
                        </span>
                        <span>
                          {item.quantity} x {item.price.toLocaleString()} VND
                        </span>
                      </li>
                    ))
                  )}
                </ul>
                <div className="total-price">
                  <span>Tổng cộng:</span>
                  <span>{getTotalPrice().toLocaleString()} VND</span>
                </div>

                {/* Phương thức thanh toán */}
                <div className="section payment-method">
                  <h3>Phương thức thanh toán</h3>
                  <div className="payment-options">
                    <label>
                      <input
                        type="radio"
                        value="creditCard"
                        checked={paymentMethod === "creditCard"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Thẻ tín dụng (QR code)
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="cashOnDelivery"
                        checked={paymentMethod === "cashOnDelivery"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Thanh toán khi nhận hàng
                    </label>
                  </div>
                </div>

                {/* Nút đặt hàng */}
                <div>
                  <button type="submit">Đặt hàng</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
