import React, { useState, useEffect } from "react";
import "../../search.css";
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useLocation, useNavigate } from "react-router-dom";
import { Range } from "react-range";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State để lưu danh mục sản phẩm
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu danh mục đã chọn

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  // Fetch danh mục sản phẩm từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://datn.up.railway.app/api/customer/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await response.json();
        setCategories(data.content); // Lưu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories(); // Gọi hàm fetch khi component render
  }, []);

  // Fetch sản phẩm từ API khi thay đổi keyword, currentPage, priceRange hoặc selectedCategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Hiển thị trạng thái tải
        let url = `https://datn.up.railway.app/api/customer/products/search?keyword=${keyword}&page=${currentPage}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
        
        if (selectedCategory) {
          url = `https://datn.up.railway.app/api/customer/categories/${selectedCategory}/products?page=${currentPage}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
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

    fetchProducts();
  }, [keyword, currentPage, priceRange, selectedCategory]); // Gọi khi keyword, currentPage, priceRange hoặc selectedCategory thay đổi

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId); // Cập nhật danh mục đã chọn
    setCurrentPage(0); // Đặt lại trang về đầu tiên khi thay đổi danh mục
  };

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
        {!selectedCategory&&keyword && <span>Search results for "{keyword}"</span>}
      </div>

      <div className="store-content">
        <aside className="sidebar">
          <h3>Lọc Giá</h3>
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

          <h3>Danh mục sản phẩm</h3>
          <ul>
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={selectedCategory === category.id ? "active" : ""}
                  >
                    {category.name}
                  </button>
                </li>
              ))
            ) : (
              <p>Đang tải danh mục...</p>
            )}
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
                key={product.product.id}
                className="product-item"
                onClick={() => navigate(`/Details/${product.product.id}`)}
              >
                <img
                  src={product.product.thumbnail.url}
                  alt={product.product.name}
                />
                <h3>{product.product.name}</h3>
                <p>{product.product.brand}</p>
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
