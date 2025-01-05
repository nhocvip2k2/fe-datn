import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../../services/Cookies";
import Header from '../header/HeaderUser';
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../../PaymentQR.css"; 
const RefundPaymentQR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const amount1 = queryParams.get("amount"); // Giá trị mặc định nếu không có `amount`
  const token = getToken();
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken.userId;

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const countdownRef = useRef(10);
  const [countdown, setCountdown] = useState(countdownRef.current);

  const baseUrl = "https://qr.sepay.vn/img";
  const account = "240120029999";
  const bank = "Techcombank";

  const paymentUrl = `${baseUrl}?acc=${account}&bank=${bank}&amount=${amount1}&des=${encodeURIComponent(
    `SEVQR1KH${userId}DH${orderId}`
  )}`;

  useEffect(() => {
    const socket = new SockJS("https://datn.up.railway.app/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/customer/${userId}/order/paySuccess`, (message) => {
        setPaymentSuccess(true);

        const timer = setInterval(() => {
          countdownRef.current -= 1;
          setCountdown(countdownRef.current);

          if (countdownRef.current === 0) {
            clearInterval(timer);
            navigate("/home");
          }
        }, 2000);

        return () => clearInterval(timer);
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [userId, navigate]);

  return (
    <>
    <Header/>
    <div className="payment-container">
      <div className="payment-success-header">
        <div className="success-icon">✓</div>
        <h1>Hoàn tiền</h1>
        <p>Mã đơn hàng: <strong>#{orderId}</strong></p>
      </div>

      <h3>Hướng dẫn thanh toán qua chuyển khoản ngân hàng</h3>

      <div className="payment-instructions">
        <div className="method method-qr">
          <h4>Cách 1: Mở app ngân hàng và quét mã QR</h4>
          <img src={paymentUrl} alt="QR Code Thanh Toán" />
          <p className="sepay-logo">SePay</p>
          <p>Trạng thái: {paymentSuccess ? "Thanh toán thành công. Về trang chủ" : "Chờ thanh toán..."} <span className="loading-spinner"></span></p>
        </div>

        <div className="method method-bank">
          <h4>Cách 2: Chuyển khoản thủ công theo thông tin</h4>
          <p><strong>Ngân hàng:</strong> {bank}</p>
          <p><strong>Chủ tài khoản:</strong> Trần Đăng Thành</p>
          <p><strong>Số TK:</strong> {account}</p>
          <p><strong>Số tiền:</strong> {amount1}đ</p>
          <p><strong>Nội dung CK:</strong> {`SEVQR1KH${userId}DH${orderId}`}</p>
          <p className="note">
            Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động xác nhận thanh toán.
          </p>
        </div>
      </div>
    </div>
    </>
  );
 
};

export default RefundPaymentQR;
