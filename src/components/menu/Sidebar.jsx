import React from "react";
import { Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";  
import HomeIcon from "@mui/icons-material/Home"; 
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/Store"; 

import "../../index.css";  // Import CSS để áp dụng các kiểu cho Sidebar

const Sidebar = () => {
  const location = useLocation(); // Theo dõi vị trí của người dùng trong ứng dụng

  // Dùng tên path để đánh dấu item nào đang được chọn
  const getActiveItem = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Box sx={{ width: 250, bgcolor: "#f4f4f4", height: "100vh", paddingTop: 5 }}>
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Dashboard" 
          className={getActiveItem("/admin/Dashboard")}  // Sử dụng getActiveItem để xác định active
        >
          <HomeIcon />
          <ListItemText primary="Trang Chủ" />
        </ListItem>
        <Divider />
        <h3>Sản Phẩm</h3>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Products" 
          className={getActiveItem("/admin/Products")}
        >
          <ShoppingCartIcon />
          <ListItemText primary="Danh Mục Sản Phẩm" />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Products" 
          className={getActiveItem("/admin/Products")}
        >
          <ShoppingCartIcon />
          <ListItemText primary="Sản Phẩm" />
        </ListItem>
        <Divider />
        <h3>Người dùng</h3>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Accounts" 
          className={getActiveItem("/admin/Accounts")}
        >
          <PeopleIcon />
          <ListItemText primary="Khách Hàng" />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Accounts" 
          className={getActiveItem("/admin/Accounts")}
        >
          <PeopleIcon />
          <ListItemText primary="Nhân viên" />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/admin/order" 
          className={getActiveItem("/admin/order")}
        >
          <PeopleIcon />
          <ListItemText primary="Đơn hàng" />
        </ListItem>
        <Divider />
        <h3>Hệ Thống</h3>
        <ListItem 
          button 
          component={Link} 
          to="/admin/Role" 
          className={getActiveItem("/admin/Role")}
        >
          <PeopleIcon />
          <ListItemText primary="Phân quyền" />
        </ListItem>
        
      </List>
    </Box>
  );
};

export default Sidebar;
