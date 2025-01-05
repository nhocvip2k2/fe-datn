import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { getToken } from "../services/Cookies";
import Header from "./header/Header";
import MenuBar from "./menu/MenuBar";
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
} from "@mui/material";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (search = "") => {
    try {
      const url = search
        ? `https://datn.up.railway.app/client/${search}`
        : "https://datn.up.railway.app/client";
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`, // Set Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once after component mounts

  // Use debounce to handle search
  const debouncedFetchData = useCallback(debounce(fetchData, 500), []);

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
      <Box
        display="flex"
        flexDirection="row"
        height="100vh"
        bgcolor="#f0f2f5"
        marginTop={6}
      >
        <MenuBar />
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
                  <TableCell>Code</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.code || 'N/A'}</TableCell>
                    <TableCell>{item.address}</TableCell>
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
