import React from "react";
import { Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";  // Import Link từ react-router-dom
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "../../index.css";
const Sidebar = () => {
  return (
    <Box sx={{ width: 250, bgcolor: "#f4f4f4", height: "100vh", paddingTop: 5 }}>
      <List>
        <ListItem button component={Link} to="/Dashboard"> {/* Thêm component Link */}
          <DashboardIcon />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/Accounts"> {/* Thêm component Link */}
          <PeopleIcon />
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button component={Link} to="/Products"> {/* Thêm component Link */}
          <ShoppingCartIcon />
          <ListItemText primary="Products" />
        </ListItem>

        <ListItem button component={Link} to="/Role"> {/* Thêm component Link */}
          <PeopleIcon />
          <ListItemText primary="roles" />
        </ListItem>

        <ListItem button component={Link} to="/Accounts"> {/* Thêm component Link */}
          <PeopleIcon />
          <ListItemText primary="Accounts" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
