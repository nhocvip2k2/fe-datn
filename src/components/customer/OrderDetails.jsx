import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thay useHistory bằng useNavigate
import "../../OrderDetails.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
import Header from '../header/HeaderUser';

const OrderDetails = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const navigate = useNavigate(); // Dùng useNavigate để điều hướng
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

  const handleReturnRequest = async (productId, status) => {
    if ( status === 2) {
      const confirmed = window.confirm("Bạn có chắc chắn muốn yêu cầu trả hàng cho sản phẩm này?");
      if (confirmed) {
        try {
          const response = await fetch(
            `https://datn.up.railway.app/api/customer/orderDetails/${productId}/return`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Yêu cầu trả hàng thất bại");
          }

          const data = await response.json();
          alert("Yêu cầu trả hàng thành công!");
          navigate(`/orderDetails/${orderId}`);
        } catch (err) {
          alert("Có lỗi xảy ra khi yêu cầu trả hàng.");
          console.error(err);
        }
      }
    } else {
      alert("Sản phẩm không đủ điều kiện yêu cầu trả hàng.");
    }
  };

  return (
    <>
      <Header />
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
            <span className="status">
  {order.orderDetails[0].status === 1 ? "Chưa thanh toán" : "Đã thanh toán"}
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
                  <div className="item-name">
                    {item.productDetail.type} 
                    {/* Hiển thị trạng thái của sản phẩm bên cạnh tên sản phẩm */}
                    <span className="item-status">
                      ({(() => {
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

                        return statusMapping[item.status] || "Trạng thái khác";
                      })()})
                    </span>
                  </div>
                  <div className="item-price">
                    {item.currentPrice.toLocaleString()} VND
                  </div>
                  <div className="item-quantity">
                    Số lượng: {item.quantity}
                  </div>
                </div>

                {/* Nút yêu cầu trả hàng nếu trạng thái là "Chưa thanh toán" hoặc "Đã thanh toán" */}
                {( item.status === 2) && (
                  <div className="return-request-button-container">
                    <button
                      className="return-request-button"
                      onClick={() => handleReturnRequest(item.productDetail.id, item.status)}
                    >
                      Yêu cầu trả hàng
                    </button>
                  </div>
                )}
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
        {order.orderDetails[0].status === 1 && (
          <div className="payment-button-container">
            <a
              href={`/PaymentQR?orderId=${order.order.id}&amount=${order.orderDetails.reduce(
                (total, item) => total + item.quantity * item.currentPrice,
                0
              )}`}
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
