import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Button, List, ListItem } from "@mui/material";

const MenuBar = () => {
  const location = useLocation();
  const [showFunctions, setShowFunctions] = useState(true);
  const [showTimesheet, setShowTimesheet] = useState(true);

  const handleToggleFunctions = () => {
    setShowFunctions(!showFunctions);
  };

  const handleToggleTimesheet = () => {
    setShowTimesheet(!showTimesheet);
  };

  const adminItems = [
    { to: "/home", text: "My Info" },
    { to: "/ListUsers", text: "Users" },
    { to: "/role", text: "Role" },
    
    { to: "/client", text: "Client" },
    
  ];

  const timesheetItems = [
    { to: "/mytimesheet", text: "a" },
    { to: "/myoff", text: "b" },
  ];

  return (
    <Box
      bgcolor="#3f51b5"
      color="white"
      width={200}
      p={3}
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h6" gutterBottom>
        Menu
      </Typography>

      <Button onClick={handleToggleFunctions} style={{ color: "white" }}>
        ADMIN
      </Button>
      {showFunctions && (
        <List>  
          {adminItems.map((item) => (
            <ListItem key={item.to}>
              <Link
                to={item.to}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight:
                    location.pathname === item.to ? "bold" : "normal",
                  backgroundColor:
                    location.pathname === item.to ? "#7986cb" : "transparent",
                  padding: "6px",
                  borderRadius: "3px",
                  display: "block",
                }}
              >
                <Typography variant="body1" gutterBottom>
                  {item.text}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      )}

      <Button onClick={handleToggleTimesheet} style={{ color: "white" }}>
        User
      </Button>
      {showTimesheet && (
        <List>
          {timesheetItems.map((item) => (
            <ListItem key={item.to}>
              <Link
                to={item.to}
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight:
                    location.pathname === item.to ? "bold" : "normal",
                  backgroundColor:
                    location.pathname === item.to ? "#7986cb" : "transparent",
                  padding: "6px",
                  borderRadius: "3px",
                  display: "block",
                }}
              >
                <Typography variant="body1" gutterBottom>
                  {item.text}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MenuBar;
