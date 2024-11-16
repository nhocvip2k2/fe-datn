import React, { useEffect, useState } from "react";
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

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Thêm state để quản lý trạng thái của MenuBar

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const fetchData = async (search = "") => {
    try {
      const url = search
        ? `http://localhost:8080/roles/${search}`
        : "http://localhost:8080/roles";
      
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
      setData(result.result);
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

  return (
    <>
      <Header />
      <Box display="flex" marginTop={8}>
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        <Box flex={1} p={2}>
          <TextField
            label="Search"
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
                  <TableCell>Description</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description || 'N/A'}</TableCell>
                    <TableCell></TableCell>
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
