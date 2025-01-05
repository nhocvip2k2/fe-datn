import React, { useEffect, useState } from 'react';
import '../../order.css'; // File CSS đã chỉnh màu sắc
import Header from '../header/HeaderUser';
import { getToken } from "../../services/Cookies";
import dayjs from 'dayjs';
import { FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaCreditCard } from 'react-icons/fa'; // Import FontAwesome icons

const Orders = () => {
  const [orders, setOrders] = useState([]); // State lưu đơn hàng
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State lỗi

  const token = getToken(); // Thay token API thực tế vào đây
  const formatDate = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'https://datn.up.railway.app/api/customer/orders?size=100',
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
  }, [token]);
 
  return (
    <div className="orders-container">
      <Header />
      <h2>Đơn hàng</h2>
      {loading && (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      )}
      {error && <p className="text-danger">Lỗi: {error}</p>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark success">
              <tr>
                <th>STT</th>
                <th>Khách hàng</th>
                <th>Địa chỉ</th>
                <th>Giá tiền</th>
                <th>Cổng thanh toán</th>
                <th>Sản phẩm</th>
                <th>Ngày Đặt Hàng</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.order.id} className="order-row">
                  <td>
                    <a href={`orderdetails/${order.order.id}`} className="text-primary">
                      {order.order.id}
                    </a>
                  </td>
                  <td>
                    <div><strong>👤 {order.order.user.name}</strong></div>
                    <div><FaPhoneAlt /> {order.order.currentPhone}</div>
                  </td>
                  <td>
                    <FaMapMarkerAlt /> {order.order.currentAddress}
                  </td>
                  <td>
                    {order.orderDetails.reduce(
                      (total, item) => total + item.currentPrice * item.quantity,
                      0
                    )}
                    VND
                  </td>
                  <td>{order.order.payment}</td>
                  <td>
                    {order.orderDetails.map((detail, detailIndex) => (
                      <div key={detailIndex} style={{ marginBottom: '8px' }}>
                        <div><strong>{detail.productDetail.type}</strong></div>
                        <div className="text-muted" style={{ fontSize: '14px' }}>
                          {(() => {
                            const detailStatusMapping = {
                              1: 'Chưa thanh toán',
                              2: 'Đã thanh toán',
                              3: 'Đang giao',
                              4: 'Đã giao đến nơi',
                              5: 'Đang trả hàng',
                              6: 'Đang kiểm tra hàng',
                              7: 'Đã giao hoàn tất',
                              8: 'Đã hủy',
                            };

                            return detailStatusMapping[detail.status] || 'Trạng thái khác';
                          })()}
                        </div>
                        {detailIndex < order.orderDetails.length - 1 && (
                          <hr className='hr-oder' style={{ border: '1px solid #ccc', margin: 0, width: '100%' }} />
                        )}
                      </div>
                    ))}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatDate(order.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
