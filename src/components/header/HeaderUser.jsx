import React, { useState, useEffect } from "react";
import "../../headerUser.css";
import CartSidebar from "../customer/CartSideBar"; // Import Sidebar
import { logOut } from "../../services/authenticationService";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false); // Trạng thái sidebar
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleLogout = () => {
    logOut();
    window.location.href = "/login";
  };
  const handleProfile = () => {
    window.location.href = "/profile";
  };
  const handleChangePassword = () => {
    window.location.href = "/ChangePassword";
  };
  const handleSearch = () => {
    if (keyword.trim()) {
      // Chuyển hướng tới trang kết quả tìm kiếm
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    };

    document.addEventListener("cartUpdated", updateCartCount);
    updateCartCount();
    return () => document.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  return (
    <>
      <header className="header">
        <div className="logo">
          <a href="/home">PTIT STORE</a>
          </div>
        <div className="header-center">
          {/* Ô tìm kiếm */}
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Xử lý khi nhấn Enter
          />
          <button className="search-btn" onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="header-right">
          {/* Biểu tượng giỏ hàng */}
          <div className="cart-icon" onClick={toggleCart}>
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>

          {/* Biểu tượng người dùng */}
          <div className="user-icon" onClick={toggleMenu}>
            <i className="fas fa-user-circle"></i>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfile}>Profile</button>
                <button onClick={handleChangePassword}>ChangePassword</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Giỏ Hàng */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Header;
