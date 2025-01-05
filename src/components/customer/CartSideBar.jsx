import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };

    fetchCartItems();
  }, [isOpen]);

  const handleRemoveItem = (id, type, color) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.type === type && item.color === color)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    document.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`offcanvas offcanvas-end ${isOpen ? "show" : ""}`}
      tabIndex="-1"
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Giỏ Hàng</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="d-flex mb-3 border-bottom pb-2">
              <img
                src={item.image}
                alt={item.name}
                className="img-thumbnail"
                style={{ width: "80px", height: "80px" }}
              />
              <div className="ms-3">
                <h6>{item.name} - {item.type} - {item.color}</h6>
                <p>Số lượng: {item.quantity}</p>
                <p>Giá: ${item.price}</p>
              </div>
              <button
  className="btn btn-danger btn-sm ms-auto  text-center p-0"
  style={{ width: "30px", height: "30px" }}
  onClick={() => handleRemoveItem(item.id, item.type, item.color)}
>
  <i className="fas fa-trash-alt"></i>
</button>

            </div>
          ))
        ) : (
          <p>Giỏ hàng của bạn đang trống.</p>
        )}
        <div className="d-flex justify-content-between mt-3">
          <span className="fw-bold">Tổng số tiền:</span>
          <span className="fw-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="offcanvas-footer mt-3">
        <a href="/Cart" className="btn btn-primary w-100">Chi Tiết</a>
      </div>
    </div>
  );
};

export default CartSidebar;
