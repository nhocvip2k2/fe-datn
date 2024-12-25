import React, { useEffect, useState } from "react";
import "../../details.css";
import { useParams } from "react-router-dom";
import Header from "../header/HeaderUser";
import { getToken } from "../../services/Cookies";

const DetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Mặc định số lượng là 1

  const [selectedType, setSelectedType] = useState(null); // Loại sản phẩm được chọn
  const [selectedColor, setSelectedColor] = useState(null); // Màu được chọn
  const [selectedCondition, setSelectedCondition] = useState(null); // Condition được chọn
  const [availableColors, setAvailableColors] = useState([]); // Danh sách màu khả dụng

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://datn.up.railway.app/api/customer/products/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        const data = await response.json();
        setProduct(data.product);
        setProductDetails(data.productDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedColor(null); // Reset màu khi loại thay đổi
    setAvailableColors(
      productDetails
        .filter((detail) => detail.type === type)
        .map((detail) => detail.color)
    );
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const condition = productDetails.find(
      (detail) => detail.type === selectedType && detail.color === color
    )?.condition;
    setSelectedCondition(condition || "Không xác định");
  };
  const handleAddToCart = () => {
    if (!selectedType || !selectedColor) {
      alert("Vui lòng chọn loại và màu trước khi thêm vào giỏ hàng!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Lấy giá sản phẩm từ productDetails
    const selectedProductDetailId = productDetails.find(
      (detail) => detail.type === selectedType && detail.color === selectedColor
    )?.id;
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === selectedProductDetailId &&
        item.type === selectedType &&
        item.color === selectedColor
    );
    // Lấy giá sản phẩm từ productDetails
    const productPrice = productDetails.find(
      (detail) => detail.type === selectedType && detail.color === selectedColor
    )?.price;

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: selectedProductDetailId,
        name: product.name,
        image: product.thumbnail.url,
        type: selectedType,
        color: selectedColor,
        price: productPrice,
        quantity: quantity,
      });
    }

    // Lưu vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Gửi sự kiện "cartUpdated" để thông báo các component khác
    document.dispatchEvent(new Event("cartUpdated"));

    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <Header />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/home">Home</a> / <a href="/home">{product.category.name}</a> /{" "}
        <span>{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="product-section">
        {/* Product Image */}
        <div className="image-container">
          <img
            // src={product.category.image.url}
            src={product.thumbnail.url}
            alt={product.name}
            className="product-image"
          />
        </div>

        {/* Product Info */}
        <div className="info-container">
          <h1 className="title">{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">{product.price}</p>

          {/* Nút chọn loại */}
          <div className="type-buttons">
            <p>
              Chọn loại:
              {selectedColor && (
                <span className="condition-text">
                  {" "}
                  {selectedCondition || "Chưa chọn"}
                </span>
              )}
            </p>
            {Array.from(new Set(productDetails.map((detail) => detail.type))).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`type-button ${selectedType === type ? "active" : ""}`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {/* Nút chọn màu */}
          {selectedType && (
            <div className="color-buttons">
              <p>Chọn màu:</p>
              {availableColors.map((color) => (
                <button
                  key={color}
                  className={`color-button ${selectedColor === color ? "active" : ""}`}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          )}
           {/* Thêm số lượng */}
  <div className="quantity-container">
    <label>Số lượng:</label>
    <input
      type="number"
      value={quantity}
      min="1"
      onChange={(e) => setQuantity(Math.max(1, e.target.value))}
    />
  </div>

          <button className="button" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>

        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
