import React, { useState, useEffect } from "react";
import "../../search.css";
import { getToken } from "../../services/Cookies";
import Header from "../header/HeaderUser";
import { useLocation, useNavigate } from "react-router-dom";
import { Range } from "react-range";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

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
        setCategories(data.content);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `https://datn.up.railway.app/api/customer/products/search?keyword=${keyword}&page=${currentPage}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&size=9`;
        
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, currentPage, priceRange, selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${currentPage === i ? "btn-primary" : "btn-outline-primary"} mx-1`}
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
      <div className="breadcrumb bg-light py-2 px-4 rounded">
        <a href="/home" className="text-decoration-none text-dark">
          Home
        </a>{" "}
        /{" "}
        <a href="/Search" className="text-decoration-none text-dark">
          Store
        </a>{" "}
        /{" "}
        {!selectedCategory && keyword && (
          <span className="text-muted">Search results for "{keyword}"</span>
        )}
      </div>
  
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-md-3 mb-4">
  <div className="border p-4 rounded shadow-sm bg-white">
    {/* Lọc giá
    <h5 className="font-weight-bold mb-4 text-primary">Lọc giá</h5>
    <div className="mb-4">
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
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(to right, #ddd ${(
                priceRange[0] / 10000
              ) * 100}%, #007bff ${(
                priceRange[0] / 10000
              ) * 100}%, #007bff ${(
                priceRange[1] / 10000
              ) * 100}%, #ddd ${(priceRange[1] / 10000) * 100}%)`,
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
              backgroundColor: "#007bff",
              border: "2px solid #fff",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        )}
      />
      <div className="d-flex justify-content-between mt-3 text-secondary">
        <span>{priceRange[0].toLocaleString()} VND</span>
        <span>{priceRange[1].toLocaleString()} VND</span>
      </div>
    </div> */}

    {/* Danh mục */}
    <h5 className="font-weight-bold mb-4 text-primary">Danh mục</h5>
    <div className="list-group">
      {categories.length > 0 ? (
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`list-group-item list-group-item-action ${
              selectedCategory === category.id
                ? "active border-0 text-white bg-primary"
                : "text-dark border-0 bg-light"
            }`}
            style={{
              borderRadius: "5px",
              marginBottom: "10px",
              boxShadow: selectedCategory === category.id ? "0px 4px 6px rgba(0, 123, 255, 0.3)" : "none",
            }}
          >
            {category.name}
          </button>
        ))
      ) : (
        <p className="text-muted">Loading categories...</p>
      )}
    </div>
  </div>
</aside>

  
          {/* Main Content */}
          <main className="col-md-9">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : noResults ? (
              <p className="text-center text-muted">
                Không có sản phẩm nào phù hợp.
              </p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {products.map((product) => (
                  <div
                    key={product.product.id}
                    className="col"
                    onClick={() => navigate(`/Details/${product.product.id}`)}
                  >
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={product.product.thumbnail.url}
                        alt={product.product.name}
                        className="card-img-top rounded"
                      />
                      <div className="card-body">
                        <h5 className="card-title text-truncate">
                          {product.product.name}
                        </h5>
                        <p className="card-text text-muted">
                          {product.product.brand}
                        </p>
                        <p className="card-text text-muted">Đã thuê : {product.hired}</p>
                        <p className="card-text fw-bold text-primary">
                          {product.minPrice} - {product.maxPrice} VND
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
  
        {/* Pagination */}
        <div className="pagination d-flex justify-content-center mt-4">
          {renderPagination()}
        </div>
      </div>
    </>
  );
}  

export default StorePage;
