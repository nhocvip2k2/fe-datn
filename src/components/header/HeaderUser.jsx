import React from "react";
import "../../home.css"; // Import file CSS (nếu cần)

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Ptit Store</div>
      <nav className="nav">
        <a href="#products" className="nav-link">Shop</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
