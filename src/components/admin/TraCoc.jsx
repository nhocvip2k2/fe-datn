import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../TraCoc.css'; // Đường dẫn CSS tùy chỉnh
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";

const TraCoc = () => {
  const navigate = useNavigate();
  const depositAmount = 900000; // Số tiền cọc ban đầu
  const [status, setStatus] = useState('');
  const [daysLate, setDaysLate] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState(depositAmount);
  const { orderDetailId } = useParams(); // Extract orderDetailId from URL
 
  const handlePenaltyChange = (value) => {
    const penalty = parseInt(value, 10) || 0;
    setPenaltyAmount(penalty);
    setRefundAmount(depositAmount - penalty); // Cập nhật số tiền hoàn lại
  };

  const handleRefund = () => {
    if (!status || daysLate === "" || penaltyAmount === "") {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin!");
      return;
    }

    if (refundAmount < 0) {
      alert("Số tiền cần đền bù không thể lớn hơn số tiền đã thanh toán!");
      return;
    }

    // Điều hướng đến trang thanh toán QR với `orderId` và `refundAmount`
    navigate(`/RefundPaymentQR?orderId=${orderDetailId}&amount=${refundAmount}`);
  };
  

  return (
    <div className="tracoc-container">
      <Header />
      <div className="tracoc-main mt-5">
        <MenuBar />
        <div className="tracoc-content">
          <h2>Hoàn tiền đặt cọc</h2>
          <form className="tracoc-form">
            <div className="form-group">
              <label htmlFor="status">Tình trạng</label>
              <input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Nhập tình trạng đơn hàng"
              />
            </div>
            <div className="form-group">
              <label htmlFor="daysLate">Số ngày trả muộn</label>
              <input
                type="text"
                id="daysLate"
                value={daysLate}
                onChange={(e) => setDaysLate(e.target.value)}
                placeholder="Nhập số ngày trả muộn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="penaltyAmount">Số tiền đền bù</label>
              <input
                type="text"
                id="penaltyAmount"
                value={penaltyAmount}
                onChange={(e) => handlePenaltyChange(e.target.value)}
                placeholder="Nhập số tiền đền bù"
              />
            </div>
            <div className="form-group">
              <label htmlFor="refundAmount">Số tiền hoàn lại</label>
              <input
                type="text"
                id="refundAmount"
                value={refundAmount}
                readOnly
              />
            </div>
            <div className="form-actions">
              <button type="button" className="tracoc-refund" onClick={handleRefund}>
                Hoàn tiền
              </button>
              <button type="button" className="tracoc-cancel" onClick={() => navigate(-1)}>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TraCoc;
