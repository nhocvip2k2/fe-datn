import React, { useEffect, useState } from "react";
import "../../details.css";
import { useParams } from 'react-router-dom';
import Header from "../header/HeaderUser";
import { getToken } from "../../services/Cookies";
const DetailsPage = () => {
  const [product, setProduct] = useState(null); // Lưu trữ dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ lỗi nếu có
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://backend-h1zl.onrender.com/api/customer/products/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
        const data = await response.json();
        setProduct(data.productDTO); // Lưu dữ liệu vào state
        setLoading(false); // Đánh dấu đã tải xong
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Nếu lỗi, cũng đánh dấu tải xong
      }
    };

    fetchProduct(); // Gọi hàm fetch khi component render
  }, []); // Chạy 1 lần khi component mount

  // Hiển thị "Loading..." khi dữ liệu chưa được tải
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/home">Home</a> / <a href="/home">{product.brand}</a> / <span>{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="product-section">
        {/* Product Image */}
        <div className="image-container">
          <img
            src={product.image || "https://via.placeholder.com/100"}
            alt={product.name || "Product Image"}
            className="product-image"
          />
        </div>

        {/* Product Info */}
        <div className="info-container">
          <h1 className="title">{product.name}</h1>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <button className="button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
