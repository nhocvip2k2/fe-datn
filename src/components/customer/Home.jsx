import React, { useState, useEffect } from "react";
import "../../home.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom"; // Hook để chuyển hướng

const Home = () => {
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [isScrolled, setIsScrolled] = useState(false); // State để kiểm tra trạng thái cuộn
  const navigate = useNavigate(); // Hook để chuyển hướng đến trang chi tiết

  // Kiểm tra nếu không có token, chuyển hướng về trang chủ
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/home"); // Chuyển hướng về trang chủ nếu không có token
    }
  }, [navigate]);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://datn.up.railway.app/api/customer/products", {
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

  const handleButtonClick = () => {
    navigate("/search"); // Chuyển hướng đến đường dẫn
  };

  // Lắng nghe sự kiện cuộn để thay đổi trạng thái header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Nếu cuộn quá 100px, thay đổi trạng thái
    };

    window.addEventListener("scroll", handleScroll); // Thêm sự kiện cuộn
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup sự kiện cuộn
    };
  }, []);

  return (
    <div className={`container hero-header ${isScrolled ? "scrolled" : ""}`}>
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PtitStore</h1>
          <p>Ưu Đãi đến 50%</p>
          <button className="button" onClick={handleButtonClick}>
            Thuê ngay
          </button>
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
              key={product.product.id}
              className="product-card"
              onClick={() => navigate(`/Details/${product.product.id}`)} // Chuyển hướng đến chi tiết sản phẩm
            >
              <img
                src={product.product.thumbnail.url} // Hiển thị ảnh từ API
                alt={product.product.name}
                className="product-image-home"
              />
              <h3>{product.product.name}</h3>
              <p>{product.product.brand}</p>
              <p>${product.minPrice} - ${product.maxPrice}</p> {/* Format giá */}
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
