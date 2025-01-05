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
  const [quantity, setQuantity] = useState(1); // Default quantity is 1

  const [selectedColor, setSelectedColor] = useState(null); // Selected color
  const [selectedCondition, setSelectedCondition] = useState(null); // Selected condition
  const [selectedPrice, setSelectedPrice] = useState(null); // Selected price
  const [availableColors, setAvailableColors] = useState([]); // Available colors list
  const [priceRange, setPriceRange] = useState([]); // State to store the highest and lowest prices
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
     
        // Set available colors for the product
        const colors = [...new Set(data.productDetails.map((detail) => detail.color))];
        setAvailableColors(colors);
        const prices = data.productDetails.map(detail => detail.price);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        setPriceRange([minPrice, maxPrice]);
        console.log("Highest Price: ", maxPrice);
        console.log("Lowest Price: ", minPrice);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      }
    };

    fetchProduct();
    
  }, [id]);
  console.log("sp" + JSON.stringify(product, null, 2));
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const condition = productDetails.find((detail) => detail.color === color)?.condition;
    const price = productDetails.find((detail) => detail.color === color)?.price;
    setSelectedPrice(price || "Không xác định");
    setSelectedCondition(condition || "Không xác định");
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu trước khi thêm vào giỏ hàng!");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedProductDetailId = productDetails.find(
      (detail) => detail.color === selectedColor
    )?.id;

    const existingItemIndex = cart.findIndex(
      (item) => item.id === selectedProductDetailId && item.color === selectedColor
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: selectedProductDetailId,
        name: product.name,
        image: product.thumbnail.url,
        color: selectedColor,
        price: selectedPrice,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    document.dispatchEvent(new Event("cartUpdated"));

    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
          <li className="breadcrumb-item"><a href="/home">Home</a></li>
          <li className="breadcrumb-item"><a href="/home">{product.category.name}</a></li>
          <li className="breadcrumb-item " aria-current="page">{product.name}</li>
        </ol>
      </nav>
  <div style={{background: 'linear-gradient(135deg, #f0f0f0, #ffffff)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px' , padding :'14px'}}>
      <div className="row" > 
        {/* Product Image */}
        <div className="col-md-6 mb-4">
        <div className="card shadow-sm border-light" style={{ width: '100%', maxWidth: '600px' }}>
  <img
    src={product.thumbnail.url}
    alt={product.name}
    className="img-fluid rounded"
    style={{ objectFit: 'cover', width: '100%', height: '370px' }} // Set height and prevent image distortion
  />
</div>

        </div>

        {/* Product Info */}
        <div className="col-md-6 ">
          <h3 className="product-title">{product.name}</h3>
          <div className="mt-3 d-flex">
  <p className="mr-4"><strong>Giá từ:</strong> {priceRange[0] ? priceRange[0] : "Chưa xác định"} VND</p>
  <p><strong>- Đến:</strong> {priceRange[1] ? priceRange[1] : "Chưa xác định"} VND</p>
</div>

          {/* Select Color */}
          <div className="mt-3">
            <p><strong>Màu:</strong></p>
            <div className="d-flex justify-content-start">
              {availableColors.map((color) => (
                <button
                  key={color}
                  className={`btn ${selectedColor === color ? "btn-primary" : "btn-outline-secondary"} mr-2`}
                  style={{ backgroundColor: color, color: selectedColor === color ? 'white' : 'black' }}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <hr />

          {/* Price */}
          {selectedColor && (
            <p className="font-weight-bold">
              <strong>Giá: </strong>{selectedPrice || "Chưa chọn"}
            </p>
          )}

          {/* Quantity Input */}
          <div className="d-flex flex-column align-items-start">
  <label htmlFor="quantity" className="mb-2"><strong>Số lượng:</strong></label>
  <input
    id="quantity"
    type="number"
    value={quantity}
    min="1"
    onChange={(e) => setQuantity(Math.max(1, e.target.value))}
    className="form-control w-25"
  />
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
