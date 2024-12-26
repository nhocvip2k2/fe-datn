import React, { useEffect, useState } from 'react';
import '../../OrderAdmin.css'; // File CSS đã chỉnh màu sắc
import Header from '../header/Header';
import {getToken} from "../../services/Cookies";
import dayjs from 'dayjs';
import MenuBar from "../menu/MenuBar";
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
          'https://datn.up.railway.app/api/admin/orders',
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
    <>
    <Header />
    <div className="orders-container-admin">
    <MenuBar/>
    <div className="layout-content">
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
              <td>
                {(() => {
                  const statusMapping = {
                    1: (
                      <a
                        href={`/PaymentQR?orderId=${order.order.id}&amount=${calculateTotalPrice(order.order.id)}`}
                        className="highlight-link"
                      >
                        Trạng thái 1 - Chưa thanh toán
                      </a>
                    ),
                    2: <span className="status-text">Trạng thái 2 - Đã thanh toán </span>,
                    3: <span className="status-text">Trạng thái 3 - Đang giao</span>,
                    4: <span className="status-text">Trạng thái 4 - Đã giao đến nơi </span>,
                    5: (
                      <a
                        href={`/PaymentQR?orderId=${order.order.id}&amount=${calculateTotalPrice(order.order.id)}`}
                        className="highlight-link"
                      >
                        Trạng thái 5 - Trả hàng, chờ hoàn cọc 
                      </a>),
                    6: <span className="status-text">Trạng thái 6 - Đã hoàn cọc  </span>,
                    7: <span className="status-text">Trạng thái 7 - Đã giao đến nơi </span>,
                    8: <span className="status-text">Trạng thái 8 - Hoàn tất </span>,
                  };

                  // Hiển thị trạng thái nếu có trong mapping, nếu không thì hiển thị giá trị mặc định
                  return statusMapping[order.status] || <span className="status-text">Trạng thái khác</span>;
                })()}
              </td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatDate(order.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
};

export default Orders;
