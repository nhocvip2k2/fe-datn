import React, { useEffect, useState } from "react";
import "../../OrderAdmin.css"; // File CSS đã chỉnh màu sắc
import Header from "../header/Header";
import { getToken } from "../../services/Cookies";
import dayjs from "dayjs";
import MenuBar from "../menu/MenuBar";

const Orders = () => {
  const [orders, setOrders] = useState([]); // State lưu đơn hàng
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State lỗi
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const token = getToken(); // Thay token API thực tế vào đây
  const formatDate = (isoDate) => dayjs(isoDate).format("DD/MM/YYYY HH:mm");

  const fetchOrders = async (page) => {
    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/orders?page=${page}&size=9`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.content); // Set dữ liệu API
      setTotalPages(data.totalPages); // Cập nhật tổng số trang
    } catch (err) {
      setError(err.message); // Lưu lỗi vào state
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <div className="orders-container-admin">
        <MenuBar />
        <div className="layout-content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Mã thuê</th>
                    <th>Khách hàng</th>
                    <th>Địa chỉ</th>
                    <th>Giá tiền</th>
                    <th>Cổng thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Khởi tạo</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <a href={`/OrderProduct/${order.id}`} style={{ color: "#007bff" }}>
                          {order.id}
                        </a>
                      </td>
                      <td>
                        <div>
                          <strong>Đơn {order.order.id}</strong>
                        </div>
                        <div>📞 {order.order.currentPhone}</div>
                      </td>
                      <td>📍 {order.order.currentAddress}</td>
                      <td>{order.currentPrice}</td>
                      <td>{order.order.payment}</td>
                      
                      <td>
                        {/* Hiển thị trạng thái */}
                        {(() => {
                          const statusMapping = {
                            1: "Chưa thanh toán",
                            2: "Đã thanh toán",
                            3: "Đang giao",
                            4: "Đã giao đến nơi",
                            5: "Yêu cầu trả hàng",
                            6: "Đã hoàn cọc",
                            7: "Đã giao đến nơi",
                            8: "Hoàn tất",
                          };
                          return statusMapping[order.status] || "Trạng thái khác";
                        })()}
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{formatDate(order.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Thanh phân trang */}
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Trang trước
                </button>
                <span>
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
