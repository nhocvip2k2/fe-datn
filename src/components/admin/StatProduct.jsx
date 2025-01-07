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
          "https://datn.up.railway.app/api/admin/products/sort",
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
    return <p>Đang tải danh sách sản phẩm thuê nhiều...</p>;
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
      <h2>Sản phẩm thuê nhiều</h2>
      <table className="best-selling-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Thương hiệu</th>
            <th>Mô tả</th>
            <th>Số lượt thuê</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item.product.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={`${item.product.thumbnail.url}`}
                  alt={item.product.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </td>
              <td>{item.product.name}</td>
              <td>{item.product.brand}</td>
              <td>{item.product.description.slice(0, 100)}...</td>
              <td>{item.hired}</td>
              <td>{item.product.status ? "Còn hàng" : "Hết hàng"}</td>
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
