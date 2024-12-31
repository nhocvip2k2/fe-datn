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
    4: "Đã giao đến nơi",
    5: "Yêu cầu trả hàng",
    6: "Đã hoàn cọc",
    7: "Đã giao đến nơi",
    8: "Hoàn tất",
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
      }

      alert("Cập nhật trạng thái thành công!");
      window.location.reload();
    } catch (error) {
      alert('Không thể cập nhật trạng thái: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">Lỗi: {error}</div>;
  }

  if (!orderDetail) {
    return <div className="no-data">Không có thông tin chi tiết đơn hàng</div>;
  }

  return (
    <div className="orderproduct-container">
      <Header />
      <div className="orderproduct-main">
        <MenuBar />
        <div className="orderproduct-content">
          <h2>Chi tiết đơn hàng</h2>
          <table className="orderproduct-table">
            <thead>
              <tr>
                <th>Mã sản phẩm thuê</th>
                <th>Tên sản phẩm</th>
                <th>Ngày thuê</th>
                <th>Giá</th>
                <th>Đơn Hàng</th>
                <th>Trạng Thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{orderDetail.id}</td>
                <td>{orderDetail.productDetail.type}</td>
                <td>{formatDate(orderDetail.createdAt)}</td>
                <td>{orderDetail.currentPrice}</td>
                <td>{orderDetail.order.id}</td>
                <td>
                  {isEditing ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(Number(e.target.value))}
                    >
                      {Object.entries(statusMapping).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    statusMapping[orderDetail.status]
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <button onClick={handleSaveClick}>Lưu</button>
                  ) : (
                    <>
                      <button onClick={handleEditClick}>Sửa</button>
                      {orderDetail.status === 4 && (
                        <button onClick={() => navigate(`/admin/TraCoc/${orderDetail.id}`)}>
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
  );
};

export default OrderProduct;
