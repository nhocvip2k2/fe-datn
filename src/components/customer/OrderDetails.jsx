import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import "../../OrderDetails.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
import Header from '../header/HeaderUser';
const OrderDetails = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://datn.up.railway.app/api/customer/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <Header/>
    <div className="order-details-container">
      <div className="order-header">
        <h1>Chi Tiết Đơn Hàng</h1>
      </div>
      <div className="order-info">
        <div>
          <strong>Mã đơn:</strong> {order.order.id}
        </div>
        <div>
          <strong>Ngày đặt:</strong>{" "}
          {new Date(order.orderDetails[0].createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Trạng thái:</strong>{" "}
          <span className="status">{(() => {
                  const statusMapping = {
                            1: "Chưa thanh toán",
                            2: "Đã thanh toán",
                            3: "Đang giao",
                            4: "Đã giao đến nơi",
                            5: "Trả hàng, chờ hoàn cọc",
                            6: "Đã hoàn cọc",
                            7: "Đã giao đến nơi",
                            8: "Hoàn tất",
                  };

                  // Hiển thị trạng thái nếu có trong mapping, nếu không thì hiển thị giá trị mặc định
                  return statusMapping[order.orderDetails[0].status] || <span className="status-text">Trạng thái khác</span>;
                })()}
                </span>
        </div>
      </div>
      <div className="order-items">
        <h2>Sản phẩm</h2>
        <ul className="item-list">
          {order.orderDetails.map((item) => (
            <li key={item.id} className="item">
              <img
                src={
                  item.productDetail.image
                    ? item.productDetail.image
                    : "/placeholder-image.png" // Hình ảnh mặc định nếu không có ảnh
                }
                alt={item.productDetail.type}
                className="item-image"
              />
              <div className="item-info">
                <div className="item-name">{item.productDetail.type}</div>
                <div className="item-price">{item.currentPrice.toLocaleString()} VND</div>
                <div className="item-quantity">Số lượng: {item.quantity}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-total">
        <strong>Tổng cộng:</strong>{" "}
        {order.orderDetails
          .reduce((total, item) => total + item.quantity * item.currentPrice, 0)
          .toLocaleString()}{" "}
        VND
      </div>
      {/* Hiển thị nút Thanh toán nếu trạng thái là 1 */}
{order.orderDetails[0].status === 1 && (
  <div className="payment-button-container">
    <a
      href={`/PaymentQR?orderId=${order.order.id}&amount=${order.orderDetails
        .reduce((total, item) => total + item.quantity * item.currentPrice, 0)}`}
      className="payment-button"
    >
      Thanh Toán
    </a>
  </div>
)}
      <div className="receiver-info">
        <h2>Thông tin người nhận</h2>
        <p>
          <strong>Họ tên:</strong> {order.order.user.name}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.order.currentAddress}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {order.order.currentPhone}
        </p>
      </div>
    </div>
    </>
  );
  
};

export default OrderDetails;
