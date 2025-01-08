import React, { useState, useEffect } from "react";
import "../../statproduct.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

const token = getToken();

const AccountsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://datn.up.railway.app/api/admin/transactions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm bán chạy.");
        }
        const data = await response.json();
        setProducts(data.content || []); // Sử dụng trường "content" từ API trả về
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách giao dịch...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }


  return (
    <div className="statproduct-container">
      {/* Header */}
      <Header />

      <div className="statproduct-main">
        {/* MenuBar */}
        <MenuBar />

        {/* Nội dung chính */}
        <div className="statproduct-content">
        <div className="best-selling-container">
      <h2>Danh sách giao dịch</h2>
      <table className="best-selling-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ngân hàng</th>
            <th>Thời gian</th>
            <th>Nội dung</th>
            <th>Số tài khoản</th>
            <th>Mã giao dịch</th>
            <th>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              
              <td>{item.gateway}</td>
              <td>{item.transactionDate}</td>
              <td>{item.content}</td>
              <td>{item.accountNumber}</td>
              <td>{item.code}</td>
              <td>{item.transferAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>
        </div>
      </div>
    
  );
};

export default AccountsAdmin;
