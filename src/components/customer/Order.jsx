import React, { useEffect, useState } from 'react';
import '../../order.css'; // File CSS đã chỉnh màu sắc
import Header from '../header/HeaderUser';
import {getToken} from "../../services/Cookies";
import dayjs from 'dayjs';
const Orders = () => {
  const [orders, setOrders] = useState([]); // State lưu đơn hàng
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State lỗi

  const token = getToken(); // Thay token API thực tế vào đây
  const formatDate = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');
  
  const calculateTotalPrice = (orderId) => {
    // Lọc các sản phẩm có cùng order.id
    const orderItems = orders.filter(item => item.order.id === orderId);

    // Tính tổng số tiền của các sản phẩm có cùng order.id
    const totalPrice = orderItems.reduce((total, item) => {
      return total + item.currentPrice * item.quantity;
    }, 0);

    return totalPrice;
  };
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'https://datn.up.railway.app/api/customer/orders',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.content); // Set dữ liệu API
      } catch (err) {
        setError(err.message); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchOrders();
  }, []);

  

  return (
    <div className="orders-container">
      <Header />
      <h2>Đơn Hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Địa chỉ</th>
            <th>Giá tiền</th>
            <th>Cổng thanh toán</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Khởi tạo</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>
                <a href={`#${order.order.id}`} style={{ color: '#007bff' }}>
                  {order.order.id}
                </a>
              </td>
              <td>
                <div>
                  <strong>👤 {order.order.id}</strong>
                </div>
                <div>📞 {order.order.currentPhone}</div>
              </td>
              <td>📍 {order.order.currentAddress}</td>
              <td>{calculateTotalPrice(order.order.id)}</td>
              <td>{order.order.payment}</td>
              <td>{order.order.shipment}</td>
              <td>{order.status}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatDate(order.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
