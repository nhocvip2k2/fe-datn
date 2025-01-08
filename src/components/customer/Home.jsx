import React, { useState, useEffect } from "react";
import "../../app.css"; // Import file CSS
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useNavigate } from "react-router-dom"; // Hook để chuyển hướng
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [isScrolled, setIsScrolled] = useState(false); // State để kiểm tra trạng thái cuộn
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
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
        setLoading(true); // Đánh dấu bắt đầu tải
        const response = await fetch(
          `https://datn.up.railway.app/api/customer/products?page=${currentPage}&size=8`, // Gửi page và size
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`, // Gửi token qua header
            },
          }
        );
        const data = await response.json();
        setProducts(data.content || []); // Lưu dữ liệu vào state
        setTotalPages(data.totalPages || 1); // Lưu tổng số trang
        setLoading(false); // Đánh dấu đã tải xong
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Nếu lỗi, cũng đánh dấu tải xong
      }
    };

    fetchProducts(); // Gọi hàm fetch khi component render
  }, [currentPage]); // Gọi lại khi currentPage thay đổi

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

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // Cập nhật trang hiện tại
    }
  };

  return (
    <div className={`container-fluid hero-header ${isScrolled ? "scrolled" : ""}`}>
      <Header />

      {/* Hero Section */}
      <section className="hero-section text-center py-5 bg-primary text-white">
        <div className="container">
          <h1 className="display-4 fw-bold"  style={{ color: "red" }}>Welcome to PtitStore</h1>
          <p className="lead">Ưu đãi lên đến <span className="fw-bold">50%</span> hôm nay!</p>
          <button className="btn btn-light btn-lg mt-3" onClick={handleButtonClick}>
            Thuê ngay
          </button>
        </div>
      </section>

      {/* Product Grid Title */}
      <section className="product-grid-title py-4 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold">Sản phẩm nổi bật</h2>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="product-grid py-4">
        <div className="container">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted">Không có sản phẩm nào để hiển thị.</p>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {products.map((product) => (
                <div key={product.product.id} className="col">
                  <div
                    className="card h-100 shadow-sm border-0"
                    onClick={() => navigate(`/Details/${product.product.id}`)}
                  >
                    <div className="card-img-wrapper" style={{ height: "50%", overflow: "hidden" }}>
                      <img
                        src={product.product.thumbnail.url}
                        alt={product.product.name}
                        className="card-img-top w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title text-truncate">{product.product.name}</h5>
                      <p className="card-text text-muted">{product.product.brand}</p>
                      <p className="card-text fw-bold text-primary">
                        {product.minPrice}đ - {product.maxPrice}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                Trang trước
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Trang {currentPage + 1} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${currentPage + 1 === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                Trang sau
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-4">
        <p className="mb-0">© 2024 PtitStore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
