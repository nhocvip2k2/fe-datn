import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { getToken } from "../../services/Cookies";

const PaymentQR = () => {
  const location = useLocation();

  // Lấy orderId và amount từ URL
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const amount1 = queryParams.get("amount");  // Lấy giá trị amount từ URL
  const token = getToken();
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken.userId;

  // Loại bỏ dấu phẩy trong giá trị amount (nếu có) và sử dụng giá trị này cho amount
  const [amount, setAmount] = useState(amount1);
  const [des, setDes] = useState(`SEVQR_01_${userId}_${orderId}`); // Giá trị mô tả mặc định

  const baseUrl = "https://qr.sepay.vn/img";
  const account = "240120029999";
  const bank = "Techcombank";
  
  // Tạo URL thanh toán với các tham số động
  const paymentUrl = `${baseUrl}?acc=${account}&bank=${bank}&amount=${amount}&des=${encodeURIComponent(des)}`;

  return (
    <div>
      <h2>Thanh Toán QR Code</h2>
      <img src={paymentUrl} alt="QR Code Thanh Toán" width={256} />
    </div>
  );
};

export default PaymentQR;
