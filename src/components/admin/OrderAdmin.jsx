import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import { getToken } from "../../services/Cookies";
import dayjs from "dayjs";
import MenuBar from "../menu/MenuBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import '../../Products.css'; // File CSS
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = getToken();
  const formatDate = (isoDate) => dayjs(isoDate).format("DD/MM/YYYY HH:mm");

  const fetchOrders = async (page) => {
    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/orders?page=${page}&size=7`,
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
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-2 col-md-3 col-4 p-0 mt-5">
            <MenuBar />
          </div>
          <div className="col-lg-10 col-md-9 col-8 mt-6">
            <div className="layout-content">
              {loading ? (
                <div className="text-center" aria-live="polite">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Đang tải dữ liệu...</span>
                  </div>
                </div>
              ) : error ? (
                <p className="text-danger" aria-live="assertive">{error}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th>Mã thuê</th>
                        <th style={{ width: '20%' }}>Khách hàng</th>
                        <th>Địa chỉ</th>
                        <th>Giá tiền</th>
                        <th>Cổng thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Khởi tạo</th>
                        <th>Cập nhật</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              href={`/OrderProduct/${order.id}`}
                              className="text-primary"
                            >
                              {order.id}
                            </a>
                          </td>
                          <td>
                            <div>
                              <strong>Đơn {order.order.id}</strong>
                            </div>
                            <div>
                              <i className="fa fa-phone"></i> {order.order.currentPhone}
                            </div>
                          </td>
                          <td>
                            <i className="fa fa-map-marker"></i> {order.order.currentAddress}
                          </td>
                          <td>{order.currentPrice} ₫</td>
                          <td>{order.order.payment}</td>
                          <td>
                            {(() => {
                              const statusMapping = {
                                1: "Chưa thanh toán",
                                2: "Đã thanh toán",
                                3: "Đang giao",
                                4: "Đã giao thành công",
                                5: "Đang trả hàng",
                                6: "Nhận hàng thành công",
                                7: "Tạo hóa đơn trả",
                                8: "Hoàn tiền thành công",
                              };
                              return (
                                <span style={{ color: "black" }}>
                                  {statusMapping[order.status] || "Trạng thái khác"}
                                </span>
                              );
                            })()}
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{formatDate(order.updatedAt)}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                window.location.href = `/OrderProduct/${order.id}`;
                              }}
                            >
                              <i className="fa fa-eye"></i> Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <i className="fa fa-chevron-left"></i> Trang trước
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      Trang {currentPage + 1} / {totalPages}
                    </span>
                  </li>
                  <li
                    className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      Trang sau <i className="fa fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
