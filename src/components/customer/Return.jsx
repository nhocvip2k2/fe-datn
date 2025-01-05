import React, { useState } from 'react';
import "../../Return.css"
const ReturnRentalPage = () => {
  const [orderId, setOrderId] = useState('');
  const [productName, setProductName] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [condition, setCondition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu nhập vào
    if (!orderId || !productName || !returnDate || !condition) {
      setMessage('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Giả lập gửi thông tin trả lại đồ (có thể thay bằng API request)
    setMessage('Đơn trả lại đồ của bạn đã được gửi thành công!');
    // Reset form sau khi gửi
    setOrderId('');
    setProductName('');
    setReturnDate('');
    setCondition('');
  };

  return (
    <div className="return-rental-page">
      <h1>Trả Lại Đồ Thuê</h1>
      <p>Vui lòng điền thông tin dưới đây để hoàn tất việc trả lại đồ đã thuê.</p>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="order-id">Mã Đơn Thuê:</label>
          <input
            type="text"
            id="order-id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-name">Tên Sản Phẩm:</label>
          <input
            type="text"
            id="product-name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="return-date">Ngày Trả Lại:</label>
          <input
            type="date"
            id="return-date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="condition">Tình Trạng Đồ Khi Trả:</label>
          <textarea
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          />
        </div>

        <button type="submit">Gửi Yêu Cầu Trả Đồ</button>
      </form>
    </div>
  );
};

export default ReturnRentalPage;
