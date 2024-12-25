import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../services/Cookies";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../../PaymentQR.css"; // Đảm bảo có file CSS để thêm kiểu

const PaymentQR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy orderId và amount từ URL
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const amount1 = queryParams.get("amount"); // Lấy giá trị amount từ URL
  const token = getToken();
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken.userId;

  // Trạng thái loading và kết quả thanh toán
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10); // Đếm ngược từ 10 giây

  const countdownRef = useRef(countdown); // Sử dụng ref để lưu giá trị countdown

  const baseUrl = "https://qr.sepay.vn/img";
  const account = "240120029999";
  const bank = "Techcombank";

  // Tạo URL thanh toán với các tham số động
  const paymentUrl = `${baseUrl}?acc=${account}&bank=${bank}&amount=${amount1}&des=${encodeURIComponent(`SEVQR1KH${userId}DH${orderId}`)}`;

  useEffect(() => {
    // Kết nối WebSocket qua SockJS và STOMP
    const socket = new SockJS("https://datn.up.railway.app/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket connected");

      stompClient.subscribe(`/customer/${userId}/order/paySuccess`, (message) => {
        // Nhận thông báo thanh toán thành công
        setPaymentSuccess(true);
        setLoading(false); // Dừng loading khi nhận được thông báo
        countdownRef.current = 10; // Đặt lại thời gian đếm ngược
        setCountdown(countdownRef.current); // Cập nhật lại giá trị đếm ngược ban đầu

        // Đếm ngược từ 10 giây
        const timer = setInterval(() => {
          countdownRef.current -= 1;
          setCountdown(countdownRef.current); // Cập nhật lại giá trị countdown mỗi giây

          if (countdownRef.current === 0) {
            clearInterval(timer);
            navigate("/home"); // Điều hướng về trang chủ sau khi đếm ngược hoàn tất
          }
        }, 1000);

        // Cleanup khi component unmount hoặc khi chuyển hướng
        return () => clearInterval(timer);
      });
    });

    // Cleanup khi component unmount
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [userId, navigate]);

  return (
    <div className="payment-container">
      <h2>Thanh Toán QR Code</h2>

      {/* Hiển thị QR Code ban đầu */}
      {!paymentSuccess && (
        <div className="qr-container">
          <img src={paymentUrl} alt="QR Code Thanh Toán" width={256} />
        </div>
      )}

      {/* Khi thanh toán thành công, hiển thị chữ đếm ngược */}
      {paymentSuccess && (
        <div className="payment-success">
          <div className="success-message">
            <span className="checkmark">V</span>
            <p>Thanh toán thành công!</p>
            <p>Chuyển hướng sau {countdown} giây...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentQR;
