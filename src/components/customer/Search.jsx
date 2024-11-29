import React, { useState, useEffect } from "react";
import "../../search.css"; // Import file CSS 
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useLocation } from "react-router-dom"; // Hook để chuyển hướng 
import { Range } from 'react-range';
import { useNavigate } from "react-router-dom"; // Hook để chuyển hướng 

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [priceRange, setPriceRange] = useState([100, 1000]); // Giá trị [min, max]
  const navigate = useNavigate(); // Hook để chuyển hướng đến trang chi tiết 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://backend-h1zl.onrender.com/api/customer/products/search?keyword=${keyword}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await response.json();
        if (data.length === 0) {
          setNoResults(true);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <>
      <Header />
      <div className="breadcrumb">
      <a href="/home">Home</a> / <a href="/store">Store</a> /{" "}
    <span>Search results for "{keyword}"</span>
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
                    height: '6px',
                    background: `linear-gradient(to right, #ddd ${priceRange[0] / 10000 * 100}%, #333 ${priceRange[0] / 10000 * 100}%, #333 ${priceRange[1] / 10000 * 100}%, #ddd ${priceRange[1] / 10000 * 100}%)`,
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
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                  }}
                />
              )}
            />
            <div className="price-range-values">
              <span>{priceRange[0]} VND</span>
              <span>{priceRange[1]} VND</span>
            </div>
          </div>
        </aside>
        <main className="product-list">

          {loading ? (
            <p>Đang tải...</p>
          ) : noResults ? (
            <p>Không có sản phẩm nào khớp với tìm kiếm của bạn.</p>
          ) : (
            products.filter(product =>
              product.minPrice <= priceRange[1] && product.maxPrice >= priceRange[0]
            ).map(product => (
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
                <p>{product.brand}</p>
                <p>{product.minPrice} - {product.maxPrice} VND</p> {/* Format giá */}
              </div>
            ))
          )}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Brandstore</p>
      </footer>
    </>
  );
};

export default StorePage;
