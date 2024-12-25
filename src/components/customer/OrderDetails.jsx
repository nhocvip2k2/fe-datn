import React, { useEffect, useState } from "react";
import "../../OrderDetails.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
const OrderDetails = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const token=getToken();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://datn.up.railway.app/api/customer/orders/2`,
         {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
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
  }, [orderId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Chi Tiết Đơn Hàng</h1>
      </div>
      <div className="order-info">
        <div>
          <strong>Mã đơn:</strong> {order.order.id}
        </div>
        <div>
          <strong>Ngày đặt:</strong> {new Date(order.productDetail.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Trạng thái:</strong> <span className="status">{order.order.status}</span>
        </div>
      </div>
      <div className="order-items">
        <h2>Sản phẩm</h2>
        <ul className="item-list">
          {order.productDetail.map((item) => (
            <li key={item.id} className="item">
              <div className="item-name">{item.name}</div>
              <div className="item-price">{item.price.toLocaleString()} VND</div>
              <div className="item-quantity">x {item.quantity}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-total">
        <strong>Tổng cộng:</strong> {order.total.toLocaleString()} VND
      </div>
      <div className="receiver-info">
        <h2>Thông tin người nhận</h2>
        <p>
          <strong>Họ tên:</strong> {order.receiver.name}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.receiver.address}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {order.receiver.phone}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
