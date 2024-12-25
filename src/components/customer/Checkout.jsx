import React, { useEffect, useState } from "react";
import "../../checkout.css";
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/Cookies";
const CheckoutPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const navigate = useNavigate();
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách huyện:", error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xã:", error);
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvinceCode = e.target.value;
    setProvince(selectedProvinceCode);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);
    if (selectedProvinceCode) {
      fetchDistricts(selectedProvinceCode);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictCode = e.target.value;
    setDistrict(selectedDistrictCode);
    setWard("");
    setWards([]);
    if (selectedDistrictCode) {
      fetchWards(selectedDistrictCode);
    }
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };
 const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const handleCheckout = async (e) => {
    e.preventDefault();
  
    // Tìm tên từ danh sách tỉnh, quận, xã/phường
    const selectedProvinceName = provinces.find((p) => p.code.toString() === province)?.name || "";
    const selectedDistrictName = districts.find((d) => d.code.toString() === district)?.name || "";
    const selectedWardName = wards.find((w) => w.code.toString() === ward)?.name || "";
  
    // Địa chỉ đầy đủ
    const fullAddress = `${specificAddress}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
  
    // Chuẩn bị dữ liệu để gửi
    const requestData = {
      productItems: cartItems.map((item) => ({
        productDetailId: item.id, 
        quantity: item.quantity,
        rentalDay: 0, // Giá trị mặc định hoặc lấy từ input
        note: "",
      })),
      currentAddress: fullAddress,
      currentPhone: phone,
      payment: paymentMethod, // Phương thức thanh toán
      shipment: "Khởi tạo thành công", // Thay bằng giá trị phù hợp
    };
  
    console.log("Dữ liệu gửi:", requestData);
  
    // Gửi request đến API
    try {
      const response = await fetch("https://datn.up.railway.app/api/customer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Hàm getToken lấy token từ localStorage hoặc nơi lưu trữ khác
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
      console.error("Lỗi từ server:", errorResponse);
      throw new Error(`Lỗi: ${response.statusText}`);
    }

    const result = await response.json();

    // Lấy mã đơn hàng từ phản hồi
    const orderId = result[0].order?.id; // Tùy thuộc vào cấu trúc API
    if (orderId) {
      localStorage.clear();


      // Chuyển hướng kèm theo mã đơn hàng
      navigate(`/PaymentQR?orderId=${orderId}&amount=${getTotalPrice()}`);
    } else {
      console.warn("Không lấy được mã đơn hàng từ phản hồi.");
    }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!");
    }
  };
  

  return (
    <>
      <Header />
      <div className="checkout-container">
        <h2>Thanh toán</h2>
        <form onSubmit={handleCheckout} className="checkout-form">
          <div className="checkout-row">
            <div className="checkout-column customer-info">
              <h3>Thông tin khách hàng</h3>
              <div className="input-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Tỉnh/Thành phố:</label>
                <select value={province} onChange={handleProvinceChange} required>
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Quận/Huyện:</label>
                <select value={district} onChange={handleDistrictChange} required>
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Xã/Phường:</label>
                <select value={ward} onChange={handleWardChange} required>
                  <option value="">Chọn xã/phường</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Địa chỉ cụ thể:</label>
                <input
                  type="text"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                  required
                />
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
