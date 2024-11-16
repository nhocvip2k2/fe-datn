import React, { useState, useEffect } from "react";
import "../../home.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
const Home = () => {
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://backend-h1zl.onrender.com/api/customer/products", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
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
      {/* Header */}
      <header className="header">
        <div className="logo">PtitStore</div>
        <nav className="nav">
          <a href="#products" className="nav-link">Shop</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PtitStore</h1>
          <p>hiiiiihhihhihhhhhhhhhihihihhgjhjhuhuhuhuhhhhhhhhhhhhh </p>
          <button className="button">Shop Now</button>
        </div>
      </section>

      {/* Product Grid Title */}
      <section className="product-grid-title">
        <h2>Sản phẩm nổi bật</h2>
      </section>

      {/* Product Grid */}
      <section id="products" className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src="https://via.placeholder.com/150" alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button className="button">Add to Cart</button>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 BrandStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
