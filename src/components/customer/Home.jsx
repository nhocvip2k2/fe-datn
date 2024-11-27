import React, { useState, useEffect } from "react";
import "../../home.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom"; // Hook để chuyển hướng

const Home = () => {
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const navigate = useNavigate(); // Hook để chuyển hướng đến trang chi tiết

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://backend-h1zl.onrender.com/api/customer/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`, // Gửi token qua header
          },
        });
        const data = await response.json();
        setProducts(data.content); // Lưu dữ liệu vào state
        setLoading(false); // Đánh dấu đã tải xong
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Nếu lỗi, cũng đánh dấu tải xong
      }
    };

    fetchProducts(); // Gọi hàm fetch khi component render
  }, []); // Chạy 1 lần khi component mount

  // Hiển thị "Loading..." khi dữ liệu chưa được tải
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PtitStore</h1>
          <p>Ưu Đãi đến 50%</p>
          <button className="button">Thuê ngay</button>
        </div>
      </section>

      {/* Product Grid Title */}
      <section className="product-grid-title">
        <h2>Sản phẩm nổi bật</h2>
      </section>

      {/* Product Grid */}
      <section id="products" className="product-grid">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào để hiển thị.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/Details/${product.id}`)} // Chuyển hướng đến chi tiết sản phẩm
            >
              <img
                src={product.image || "https://via.placeholder.com/150"} // Hiển thị ảnh từ API
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.price} VND</p> {/* Format giá */}
              <button className="button">View Details</button>
            </div>
          ))
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 PtitStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
