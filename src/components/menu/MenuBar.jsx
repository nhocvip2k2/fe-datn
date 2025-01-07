import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaCogs, FaBars } from "react-icons/fa";

import "../../MenuBar.css";

const MenuBar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Trang chủ", icon: <FaHome />, link: "/admin/dashboard" },
    {
      id: "products",
      label: "Sản phẩm",
      icon: <FaBox />,
      children: [
        { id: "product-category", label: "Danh mục sản phẩm", link: "/admin/categoryadmin" },
        { id: "product-list", label: "Sản phẩm", link: "/admin/products" },
      ],
    },
    {
      id: "users",
      label: "Người dùng",
      icon: <FaUsers />,
      children: [
        { id: "customers", label: "Khách hàng", link: "/admin/accounts" },
        { id: "orders", label: "Đơn hàng", link: "/admin/order" },
      ],
    },
    {
      id: "system",
      label: "Thống Kê Hệ thống",
      icon: <FaCogs />,
      children: [
        { id: "statproduct", label: "Sản phẩm thuê nhiều", link: "/admin/statproduct" },
        { id: "revenue", label: "Chi tiết doanh thu", link: "/admin/revenue" }
      ],
    },
  ];

  const handleSelect = (link) => {
    setSelected(link);
    setIsOpen(false);
  };

  const isActive = (link) => (selected === link ? "bg-dark" : "");

  return (
    <div className="d-flex h-100">
      {/* Toggle button for small screens */}
      <button
        className="btn btn-primary d-md-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}
      >
        <FaBars />
      </button>

      <nav
        className={`bg-primary text-white p-3 ${isOpen ? "d-block" : "d-none"} d-md-block`}
        style={{
          position: "fixed",
          top: 46,
          left: 0,
          width: "250px",
          height: "100vh",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >

        <div className="menu-logo mb-4"></div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.id} className={`nav-item ${isActive(item.link)}`}>
              {!item.children ? (
                <Link
                  className="nav-link text-white d-flex align-items-center"
                  to={item.link}
                  onClick={() => handleSelect(item.link)}
                >
                  {item.icon} <span className="ms-2">{item.label}</span>
                </Link>
              ) : (
                <>
                  <div
                    className="nav-link text-white d-flex align-items-center justify-content-between"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item.id}-submenu`}
                    aria-expanded={isActive(item.link) ? "true" : "false"}
                    aria-controls={`${item.id}-submenu`}
                  >
                    <div className="d-flex align-items-center">
                      {item.icon} <span className="ms-2">{item.label}</span>
                    </div>
                    <span className="dropdown-toggle"></span>
                  </div>
                  <ul className="collapse list-unstyled ps-3" id={`${item.id}-submenu`}>
                    {item.children.map((subItem) => (
                      <li key={subItem.id} className={`nav-item ${isActive(subItem.link)}`}>
                        <Link
                          className="nav-link text-white"
                          to={subItem.link}
                          onClick={() => handleSelect(subItem.link)}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;
