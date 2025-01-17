import React, { useState, useEffect } from "react";
import "../../search.css";
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useLocation, useNavigate } from "react-router-dom";
import { Range } from "react-range";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";
  const categoryId=searchParams.get("id");
  const fetchProducts = async () => {
    try {
      setLoading(true); // Hiển thị trạng thái tải
      const response = await fetch(
        `https://datn.up.railway.app/api/customer/categories/${categoryId}/products/filter/?page=${currentPage}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (data.content.length === 0) {
        setNoResults(true);
      } else {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setNoResults(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Gọi fetchProducts khi keyword, currentPage, hoặc priceRange thay đổi
  useEffect(() => {
    fetchProducts();
  }, [keyword, currentPage, priceRange]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <Header />
      <div className="breadcrumb">
        <a href="/home">Home</a> / <a href="/Search">Store</a> /{" "}
        {keyword && <span>Search results for "{keyword}"</span>}
      </div>

      <div className="store-content">
        <aside className="sidebar">
          <h3>Filter by Price</h3>
          <div className="price-range-container">
            <Range
              step={50}
              min={0}
              max={10000}
              values={priceRange}
              onChange={(values) => setPriceRange(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="range-track"
                  style={{
                    ...props.style,
                    height: "6px",
                    background: `linear-gradient(to right, #ddd ${
                      (priceRange[0] / 10000) * 100
                    }%, #333 ${(priceRange[0] / 10000) * 100}%, #333 ${
                      (priceRange[1] / 10000) * 100
                    }%, #ddd ${(priceRange[1] / 10000) * 100}%)`,
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="range-thumb"
                  style={{
                    ...props.style,
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#333",
                  }}
                />
              )}
            />
            <div className="price-range-values">
              <span>{priceRange[0]} VND</span>
              <span>{priceRange[1]} VND</span>
            </div>
          </div>
          
          <h3>Categories</h3>
          <ul>
            <li>
              <a href="/Điện thoại">Điện thoại</a>
            </li>
            <li>
              <a href="/Tablet">Tablet</a>
            </li>
            <li>
              <a href="/Đồng Hồ">Đồng Hồ</a>
            </li>
            <li>
              <a href="/Âm Thanh">Âm Thanh</a>
            </li>
            <li>
              <a href="/SmartHome">SmartHome</a>
            </li>
          </ul>
        </aside>
        <main className="product-list">
          {loading ? (
            <p>Đang tải...</p>
          ) : noResults ? (
            <p>Không có sản phẩm nào khớp với tìm kiếm của bạn.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/Details/${product.id}`)}
              >
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>{product.brand}</p>
                <p>
                  {product.minPrice} - {product.maxPrice} VND
                </p>
              </div>
            ))
          )}
        </main>
      </div>
      <div className="pagination">{renderPagination()}</div>
    </>
  );
};

export default StorePage;
