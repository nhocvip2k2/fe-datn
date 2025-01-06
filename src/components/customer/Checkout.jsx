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
    return cartItems.reduce((total, item) => total + item.price * item.quantity* item.rentalDays+item.deposit * item.quantity, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const selectedProvinceName = provinces.find((p) => p.code.toString() === province)?.name || "";
    const selectedDistrictName = districts.find((d) => d.code.toString() === district)?.name || "";
    const selectedWardName = wards.find((w) => w.code.toString() === ward)?.name || "";

    const fullAddress = `${specificAddress}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;

    const requestData = {
      productItems: cartItems.map((item) => ({
        productDetailId: item.id,
        quantity: item.quantity,
        rentalDay: item.rentalDays,
        note: "",
      })),
      currentAddress: fullAddress,
      currentPhone: phone,
      payment: paymentMethod,
      shipment: "Khởi tạo thành công",
    };

    try {
      const response = await fetch("https://datn.up.railway.app/api/customer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.statusText}`);
      }

      const result = await response.json();
      const orderId = result.id;

      if (orderId) {
        localStorage.clear();
        navigate(`/PaymentQR?orderId=${orderId}&amount=${getTotalPrice()}`);
      } else {
        console.warn("Không lấy được mã đơn hàng từ phản hồi.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("số lượng vượt quá");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5 border p-4">
        <h2 className="text-center mb-4">Thanh toán</h2>
        <form onSubmit={handleCheckout}>
          <div className="row">
            <div className="col-md-6 border-end">
              <h4>Thông tin khách hàng</h4>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tỉnh/Thành phố</label>
                <select
                  className="form-select"
                  value={province}
                  onChange={handleProvinceChange}
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Quận/Huyện</label>
                <select
                  className="form-select"
                  value={district}
                  onChange={handleDistrictChange}
                  required
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Xã/Phường</label>
                <select
                  className="form-select"
                  value={ward}
                  onChange={handleWardChange}
                  required
                >
                  <option value="">Chọn xã/phường</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  className="form-control"
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-5 ms-3 p-4" style={{background: 'linear-gradient(135deg, #f0f0f0, #ffffff)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
  <h4>Giỏ hàng</h4>
  <ul className="list-group mb-4">
    {cartItems.length === 0 ? (
      <li className="list-group-item">Giỏ hàng của bạn hiện tại đang trống</li>
    ) : (
      cartItems.map((item) => (
        <li key={item.id} className="list-group-item d-flex justify-content-between">
          <span>
            {item.name}-{item.type}
          </span>
          <span>
               x {item.quantity} / {item.rentalDays} Ngày
          </span>
        </li>
      ))
    )}
  </ul>
  <div className="d-flex justify-content-between mb-4">
    <span>Tổng cộng:</span>
    <span>{getTotalPrice().toLocaleString()} VND</span>
  </div>

  <h5>Phương thức thanh toán</h5>
  <div className="form-check">
    <input
      type="radio"
      className="form-check-input"
      value="creditCard"
      checked={paymentMethod === "creditCard"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <label className="form-check-label">Thẻ tín dụng (QR code)</label>
  </div>
  <div className="form-check">
    <input
      type="radio"
      className="form-check-input"
      value="cashOnDelivery"
      checked={paymentMethod === "cashOnDelivery"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <label className="form-check-label">Thanh toán khi nhận hàng</label>
  </div>

  <button type="submit" className="btn btn-primary w-100 mt-4">
    Đặt hàng
  </button>
</div>

          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutPage;
