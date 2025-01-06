import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import { getToken } from "../../services/Cookies";
import '../../OrderProduct.css';
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";
import dayjs from "dayjs";

const OrderProduct = () => {

  const { orderDetailId } = useParams();
  const navigate = useNavigate(); // Hook điều hướng
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(null);

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

  const formatDate = (isoDate) => dayjs(isoDate).format("DD/MM/YYYY HH:mm");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = getToken();

      try {
        const response = await fetch(`https://datn.up.railway.app/api/admin/orders/${orderDetailId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi tải thông tin chi tiết đơn hàng');
        }

        const data = await response.json();
        setOrderDetail(data.orderDetail);
        setNewStatus(data.orderDetail.status); // Gán trạng thái hiện tại
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderDetailId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = getToken();

    if (!newStatus || !statusMapping[newStatus]) {
      alert("Trạng thái không hợp lệ");
      return;
    }

    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/orders/${orderDetailId}?status=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi cập nhật trạng thái');
        window.location.reload();
      }

      alert("Cập nhật trạng thái thành công!");
      window.location.reload();
    } catch (error) {
      alert('Không thể cập nhật trạng thái: ' + error.message);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }


  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!orderDetail) {
    return <div className="no-data">Không có thông tin chi tiết đơn hàng</div>;
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        {/* MenuBar */}
        <div className="col-lg-2 col-md-3 col-4 p-0 bg-light border-end mt-5">
          <MenuBar />
        </div>

        {/* Nội dung chính */}
        <div className="col-lg-10 col-md-9 col-8 p-4 mt-6">
          <h2 className="text-primary mb-4">Chi tiết đơn hàng</h2>

          {/* Bảng chi tiết đơn hàng */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Mã sản phẩm thuê</th>
                  <th>Tên sản phẩm</th>
                  <th>Ngày thuê</th>
                  <th>Số lượng</th>
                  <th>Giá thuê</th>
                  <th>Cọc</th>
                  <th>Đơn Hàng</th>
                  <th>Trạng Thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{orderDetail.id}</td>
                  <td>{orderDetail.productDetail.type}</td>
                  <td>{formatDate(orderDetail.createdAt)}</td>
                  <td>{orderDetail.id}</td>
                  <td>{(orderDetail.currentPrice + orderDetail.currentDeposit).toLocaleString()}₫</td>
                  <td>{(orderDetail.currentDeposit).toLocaleString()}₫</td>
                  <td>{orderDetail.order.id}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(Number(e.target.value))}
                        className="form-select"
                      >
                        {Object.entries(statusMapping)
                          .filter(
                            ([key]) =>
                              Number(key) >= orderDetail.status && // Lớn hơn hoặc bằng trạng thái hiện tại
                              Number(key) >= 3 && // Trạng thái từ 3 trở đi
                              Number(key) <= 8 && // Trạng thái không vượt quá 8
                              Number(key) === orderDetail.status + 1 // Chỉ lớn hơn trạng thái hiện tại đúng 1
                          )
                          .map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span
                        className={`badge ${orderDetail.status === 1
                            ? "bg-warning"
                            : orderDetail.status === 2
                              ? "bg-success"
                              : "bg-info"
                          }`}
                      >
                        {statusMapping[orderDetail.status]}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <button className="btn btn-success btn-sm me-2" onClick={handleSaveClick}>
                        Lưu
                      </button>
                    ) : (
                      <>
                        {orderDetail.status !== 1 && orderDetail.status !== 6 ? (
                          <button className="btn btn-warning btn-sm me-2" onClick={handleEditClick}>
                            Sửa
                          </button>
                        ) : (
                          <span className="text-muted">
                            {orderDetail.status === 1 ? "Không thể sửa" : ""}
                          </span>
                        )}
                        {orderDetail.status === 6 && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              navigate(`/admin/TraCoc/${orderDetail.id}/${orderDetail.currentDeposit}`)
                            }
                          >
                            Trả Cọc
                          </button>
                        )}
                      </>
                    )}
                  </td>


                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

};

export default OrderProduct;
