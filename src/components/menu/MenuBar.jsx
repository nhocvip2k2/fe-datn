import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaCogs } from "react-icons/fa";
import "../../MenuBar.css";

const MenuBar = () => {
  const location = useLocation(); // Để lấy URL hiện tại
  const [selected, setSelected] = useState(location.pathname);

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
        { id: "staff", label: "Nhân viên", link: "/staff" },
        { id: "customers", label: "Khách hàng", link: "/admin/accounts" },
        { id: "orders", label: "Đơn hàng", link: "/admin/order" },
      ],
    },
    {
      id: "system",
      label: "Hệ thống",
      icon: <FaCogs />,
      children: [{ id: "permissions", label: "Phân quyền hệ thống", link: "/admin/role" }],
    },
  ];

  const handleSelect = (link) => {
    setSelected(link);
  };

  return (
    <div className="menu-bar">
      <div className="menu-logo">MENU</div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.id} className={selected === item.link ? "selected" : ""}>
            <Link to={item.link || "#"} onClick={() => handleSelect(item.link)}>
              <div className="menu-item">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
            {item.children && (
              <ul className="submenu">
                {item.children.map((subItem) => (
                  <li
                    key={subItem.id}
                    className={selected === subItem.link ? "selected" : ""}
                  >
                    <Link to={subItem.link} onClick={() => handleSelect(subItem.link)}>
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuBar;
