import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getToken } from "../../services/Cookies";
import Header from "../header/Header";
import Sidebar from "../menu/Sidebar";
import {
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Icon cho Xem
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const fetchData = async (search = "") => {
    try {
      const url = search
        ? `https://backend-h1zl.onrender.com/api/admin/products/${search}`
        : "https://backend-h1zl.onrender.com/api/admin/products";
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result.content);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const search = event.target.value;
    setSearchTerm(search);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchData(searchTerm);
    }
  };

  // Các hàm điều hướng đến các trang khác nhau
  const handleViewClick = (id) => {
    navigate(`/product/details/${id}`); // Đường dẫn cho Xem chi tiết
  };

  const handleEditClick = (id) => {
    navigate(`/edit-product/${id}`); // Đường dẫn cho Sửa
  };

  const handleDeleteClick = (id) => {
    navigate(`/delete-product/${id}`); // Đường dẫn cho Xóa
  };

  return (
    <>
      <Header />
      <Box display="flex" marginTop={8}>
        <Box
          sx={{
            position: "sticky",
            top: 0, // Vị trí dính bắt đầu (tính từ đỉnh)
            height: "100vh", // Chiều cao toàn màn hình
            overflowY: "auto", // Cho phép cuộn nội dung Sidebar nếu cần
          }}
       >
          <Sidebar />
        </Box>
        <Box flex={1} p={2}>
          <TextField
            label="Search by name, brand..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            margin="normal"
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Actions</TableCell> {/* Thêm cột Actions */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id} hover style={{ cursor: "pointer" }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brand || 'N/A'}</TableCell>
                    <TableCell>
                      {/* Các icon Xem, Sửa, Xóa */}
                      <IconButton onClick={() => handleViewClick(item.id)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(item.id)} color="secondary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default TableComponent;
