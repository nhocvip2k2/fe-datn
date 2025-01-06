import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../header/HeaderUser";
import { getToken } from "../../services/Cookies";
import "../../details.css";

const DetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1); // Default rental days is 1
  const [selectedType, setSelectedType] = useState(null); // Selected type
  const [selectedColor, setSelectedColor] = useState(null); // Selected color
  const [selectedCondition, setSelectedCondition] = useState(null); // Selected condition
  const [selectedPrice, setSelectedPrice] = useState(null); // Selected price
  const [selectedTonkho, setSelectedTonkho] = useState(null); 
  const [selectedDeposit, setSelectedDeposit] = useState(null); // Selected price
  const [availableTypes, setAvailableTypes] = useState([]); // Available types
  const [availableColors, setAvailableColors] = useState([]); // Available colors
  const [priceRange, setPriceRange] = useState([]); // Highest and lowest prices

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

        // Extract available types
        const types = [...new Set(data.productDetails.map((detail) => detail.type))];
        setAvailableTypes(types);

        // Calculate price range
        const prices = data.productDetails.map((detail) => detail.price);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        setPriceRange([minPrice, maxPrice]);
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

    // Filter available colors based on selected type
    const colors = [
      ...new Set(productDetails.filter((detail) => detail.type === type).map((detail) => detail.color)),
    ];
    setAvailableColors(colors);

    setSelectedColor(null); // Reset color when type changes
    setSelectedCondition(null);
    setSelectedPrice(null);
    setSelectedDeposit(null);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const detail = productDetails.find(
      (detail) => detail.type === selectedType && detail.color === color
    );
    setSelectedCondition(detail?.condition || "Không xác định");
    setSelectedPrice(detail?.price || "Không xác định");
    setSelectedDeposit(detail?.deposit || "Không xác định");
    setSelectedTonkho(detail?.inventory || "Không xác định");
  };
  const handleAddToCart = () => {
    if (!selectedType) {
      alert("Vui lòng chọn loại trước!");
      return;
    }
    if (!selectedColor) {
      alert("Vui lòng chọn màu trước khi thêm vào giỏ hàng!");
      return;
    }
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedProductDetailId = productDetails.find(
      (detail) => detail.type === selectedType && detail.color === selectedColor
    )?.id;
  
    const existingItemIndex = cart.findIndex(
      (item) => item.id === selectedProductDetailId && item.color === selectedColor
    );
  
    if (existingItemIndex !== -1) {
      // Cập nhật số lượng và số ngày thuê nếu sản phẩm đã tồn tại
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].rentalDay += rentalDays; // Cộng thêm số ngày thuê mới
    } else {
      // Thêm sản phẩm mới nếu chưa tồn tại
      cart.push({
        id: selectedProductDetailId,
        name: product.name,
        image: product.thumbnail.url,
        type: selectedType,
        color: selectedColor,
        price: selectedPrice,
        deposit: selectedDeposit,
        quantity: quantity,
        rentalDays: rentalDays, // Gán số ngày thuê
      });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    document.dispatchEvent(new Event("cartUpdated"));
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <Header />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/home">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/home">{product.category.name}</a>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>
      <div
        style={{
          background: "linear-gradient(135deg, #f0f0f0, #ffffff)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          padding: "14px",
        }}
      >
        <div className="row">
          {/* Product Image */}
          <div className="col-md-6 mb-4">
  <div
    className="card shadow-sm border-light"
    style={{
      width: "100%",
      maxWidth: "600px",
      height: "430px", // Đặt chiều cao cố định cho khung ảnh
      overflow: "hidden", // Ẩn phần ảnh thừa
    }}
  >
    <img
      src={product.thumbnail.url}
      alt={product.name}
      className="img-fluid rounded"
      style={{
        objectFit: "contain", // Duy trì tỉ lệ, đảm bảo không vỡ ảnh
        width: "100%",
        height: "100%", // Hình ảnh sẽ khớp với kích thước khung
      }}
    />
  </div>
</div>


          {/* Product Info */}
          <div className="col-md-6">
            <h3 className="product-title">{product.name}</h3>
            <div className="mt-3 d-flex">
              <p className="mr-4">
                <strong>Giá từ:</strong> {priceRange[0] || "Chưa xác định"} VND
              </p>
              <p>
                <strong>- Đến:</strong> {priceRange[1] || "Chưa xác định"} VND
              </p>
            </div>

            {/* Select Type */}
            <div className="mt-3">
              <p>
                <strong>Loại:</strong>
              </p>
              <div className="d-flex justify-content-start">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    className={`btn ${
                      selectedType === type
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    } mr-2`}
                    onClick={() => handleTypeSelect(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Color */}
            {selectedType && (
              <div className="mt-3">
                <p>
                  <strong>Màu:</strong>
                </p>
                <div className="d-flex justify-content-start">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`btn ${
                        selectedColor === color
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      } mr-2`}
                      style={{
                        backgroundColor: color,
                        color: selectedColor === color ? "white" : "black",
                      }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <hr />

            {/* Price */}
            {selectedColor && (
              <p className="font-weight-bold">
                <strong>Giá thuê: </strong>
                {selectedPrice.toLocaleString() || "Chưa chọn"} / ngày
              </p>
            )}
             {/* Price */}
             {selectedColor && (
              <p className="font-weight-bold">
                <strong>Còn hàng: </strong>
                {selectedTonkho.toLocaleString() || "Chưa chọn"} 
              </p>
            )}
 

 <div className="d-flex flex-wrap align-items-center mt-3">
  {/* Rental Days Input */}
  <div className="d-flex flex-column me-4">
    <label htmlFor="rentalDays" className="mb-2"><strong>Số ngày thuê:</strong></label>
    <input
      id="rentalDays"
      type="number"
      value={rentalDays}
      min="1"
      onChange={(e) => setRentalDays(Math.max(1, e.target.value))}
      className="form-control w-100"
    />
  </div>

  {/* Quantity Input */}
  <div className="d-flex flex-column">
    <label htmlFor="quantity" className="mb-2"><strong>Số lượng:</strong></label>
    <input
      id="quantity"
      type="number"
      value={quantity}
      min="1"
      onChange={(e) => setQuantity(Math.max(1, e.target.value))}
      className="form-control w-100"
    />
  </div>

  </div>

            {/* Add to Cart Button */}
            <button
              className="btn btn-primary btn-lg mt-4"
              onClick={handleAddToCart}
            >
              <i className="fas fa-cart-plus mr-2"></i> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div className="mt-1">
          <h4>Chi tiết sản phẩm</h4>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
