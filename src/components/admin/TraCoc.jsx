import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../TraCoc.css'; // Đường dẫn CSS tùy chỉnh
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";
import { getToken } from '../../services/Cookies'; // Giả sử bạn có hàm lấy token

const TraCoc = () => {
  const navigate = useNavigate();
  const { depositAmount, orderDetailId, userId } = useParams(); // Extract từ URL
  const [status, setStatus] = useState('');
  const [condition, setCondition] = useState('Mới');
  const [quantity, setQuantity] = useState(1);
  const [daysLate, setDaysLate] = useState('');
  const [latePenalty, setLatePenalty] = useState('');
  const [damagePenalty, setDamagePenalty] = useState('');
  const [refundAmount, setRefundAmount] = useState(depositAmount);

  const handlePenaltyChange = (late, damage) => {
    const lateFee = parseInt(late, 10) || 0;
    const damageFee = parseInt(damage, 10) || 0;
    setRefundAmount(depositAmount - lateFee - damageFee); // Cập nhật số tiền hoàn lại
  };

  const handleRefund = async () => {
    // Kiểm tra và validate dữ liệu trước khi gửi
    if (
      !status || 
      daysLate === "" || 
      latePenalty === "" || 
      damagePenalty === "" || 
      quantity <= 0
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin!");
      return;
    }
  
    if (refundAmount < 0) {
      alert("Số tiền cần đền bù không thể lớn hơn số tiền đã thanh toán!");
      return;
    }
  
    // Lấy token từ cookie hoặc localStorage
    const token = getToken();
    const apiUrl = `https://datn.up.railway.app/api/admin/orders/${orderDetailId}/return`;
  
    // Tạo body JSON
    const requestBody = {
      quantity: parseInt(quantity, 10),
      overdueDate: parseInt(daysLate, 10),
      overdueFee: parseInt(latePenalty, 10),
      damageOrLossFee: parseInt(damagePenalty, 10),
      feeDetail: status,
      condition: condition,
    };
  
    try {
      // Gửi request bằng fetch
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), 
      });
  
      // Kiểm tra phản hồi
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi xảy ra khi gửi yêu cầu!');
      }
  
      const data = await response.json();
      alert('Hoàn trả thành công!');
      navigate(`/RefundPaymentQR?userId=${userId}&amount=${refundAmount}&orderId=${orderDetailId}`); 
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };
  
  return (
    <div className="tracoc-container">
      <Header />
      <div className="tracoc-main mt-5">
        <MenuBar />
        <div className="tracoc-content">
          <h2>Hoàn trả sản phẩm</h2>
          <form className="tracoc-form">
            <div className="form-group">
              <label htmlFor="quantity">Số lượng</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nhập số lượng sản phẩm"
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Tình trạng</label>
              <input
                type="text"
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Nhập tình trạng sản phẩm (VD: Mới, Hư hỏng)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Chi tiết phí</label>
              <input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Nhập chi tiết phí (VD: Phí trễ hạn, phí hư hỏng)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="daysLate">Số ngày trả muộn</label>
              <input
                type="number"
                id="daysLate"
                value={daysLate}
                onChange={(e) => setDaysLate(e.target.value)}
                placeholder="Nhập số ngày trả muộn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="latePenalty">Đền bù do trễ hẹn</label>
              <input
                type="number"
                id="latePenalty"
                value={latePenalty}
                onChange={(e) => {
                  setLatePenalty(e.target.value);
                  handlePenaltyChange(e.target.value, damagePenalty);
                }}
                placeholder="Nhập số tiền đền bù trễ hẹn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="damagePenalty">Đền bù do mất mát, hư hỏng</label>
              <input
                type="number"
                id="damagePenalty"
                value={damagePenalty}
                onChange={(e) => {
                  setDamagePenalty(e.target.value);
                  handlePenaltyChange(latePenalty, e.target.value);
                }}
                placeholder="Nhập số tiền đền bù mất mát, hư hỏng"
              />
            </div>
            <div className="form-group">
              <label htmlFor="refundAmount">Số tiền hoàn lại</label>
              <input
                type="number"
                id="refundAmount"
                value={refundAmount}
                readOnly
              />
            </div>
            <div className="form-actions">
              <button type="button" className="tracoc-refund" onClick={handleRefund}>
                Hoàn trả
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
