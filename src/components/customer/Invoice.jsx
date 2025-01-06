import React, { useEffect, useState } from 'react';
import '../../Invoice.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from "../../services/Cookies";
import Header from '../header/HeaderUser';
import dayjs from 'dayjs';
const Invoice = () => {
    const { productId, orderDetailId } = useParams(); // Extract từ URL
  const [invoiceData, setInvoiceData] = useState(null);
  const [productDetails, setProductDetails] = useState([]);

  // Token để gửi trong yêu cầu
  const token = getToken(); 
const formatDate = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm');
  // Lấy thông tin hóa đơn
  useEffect(() => {
    fetch(`https://datn.up.railway.app/api/customer/orderReturns/${orderDetailId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token trong header
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setInvoiceData(data);
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi tải thông tin hóa đơn:', error);
      });
  }, [token]);

  // Lấy thông tin sản phẩm
  useEffect(() => {
    fetch(`https://datn.up.railway.app/api/customer/orderDetails/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token trong header
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProductDetails(data);
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi tải thông tin sản phẩm:', error);
      });
  }, [token]);

  if (!invoiceData || productDetails.length === 0) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Render hóa đơn với dữ liệu từ API
  return (
    <>
    <Header />
    <div className="invoice-container">
      <h2 className="invoice-header">Hóa Đơn</h2>
      <div className="invoice-info">
        <div className="customer-info">
          <h3>{invoiceData.customerName}</h3>
          <p>Số điện thoại khách hàng: <strong>{productDetails.order.currentPhone}</strong></p>
          <p>Địa chỉ khách hàng: <strong>{productDetails.order.currentAddress}</strong></p>
        </div>
        <div className="invoice-details">
          <p>Hóa đơn: <strong>#{productDetails.orderReturn.id}</strong></p>
          <p>Ngày: <strong>{formatDate(productDetails.orderReturn.createdAt)}</strong></p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Mã sản phẩm thuê</th>
            <th>Sản phẩm</th>
            <th>Số lượng trả</th>
            <th>Số lượng mất</th>
            <th>Số ngày trả muộn</th>
            <th>Phí trả muộn</th>
            <th>Tình Trạng</th>
            <th>Phí hư hỏng / làm mất</th>
            <th>Tiền cọc</th>
            <th>Tiền hoàn</th>
          </tr>
        </thead>
        <tbody>
          
        <td>{productDetails.id}</td>
              <td>{productDetails.productDetail.type}</td>
              <td>{invoiceData.quantity}</td>
              <td>{invoiceData.quantityLoss}</td>
              <td>{invoiceData.overdueDate}</td>
              <td>{invoiceData.overdueFee.toLocaleString()}</td>
              <td>{invoiceData.condition}</td>
              <td>{invoiceData.damageOrLossFee.toLocaleString()}</td>
              <td>{(productDetails.productDetail.deposit*(invoiceData.quantity+invoiceData.quantityLoss)).toLocaleString()}</td>
              <td>{(productDetails.productDetail.deposit*(invoiceData.quantity+invoiceData.quantityLoss)-invoiceData.damageOrLossFee-invoiceData.overdueFee).toLocaleString()}</td>
           
         
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="9" className="total-label">Tổng tiền hoàn lại:</td>
            <td className="total-amount">
            {(productDetails.productDetail.deposit*(invoiceData.quantity+invoiceData.quantityLoss)-invoiceData.damageOrLossFee-invoiceData.overdueFee).toLocaleString()}đ
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="payment-info">
        <h3>Thông tin thanh toán</h3>
        <p>Ngân hàng: Techcombank</p>
        <p>Tên khách hàng: {productDetails.order.user.name}</p>
        <p>Số tài khoản: 123456789</p>
      </div>

      <div className="contact-info">
        <h3>Thông tin liên hệ</h3>
        <p>Email: PtitStore@gmail.com</p>
        <p>Địa chỉ: Hà Đông, Hà Nội, Việt Nam</p>
        <p>Hotline: 0356789</p>
        <p>Website: <a href={`/home`} target="_blank" rel="noopener noreferrer">{invoiceData.id}</a></p>
      </div>
    </div>
    </>
  );
};

export default Invoice;
