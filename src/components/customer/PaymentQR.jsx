import React, { useState } from 'react';

const PaymentQR = () => {
  const [amount, setAmount] = useState(100000); // Giá trị mặc định
  const [des, setDes] = useState("góp gạch cho Thành"); // Giá trị mô tả mặc định

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
