import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Header from "../header/Header";
import Sidebar from "../menu/Sidebar";
import {getToken} from "../../services/Cookies";
import "../../index.css";

// Data mẫu cho biểu đồ
const barChartData = [
  { name: "Jan", users: 4000 },
  { name: "Feb", users: 3000 },
  { name: "Mar", users: 2000 },
  { name: "Apr", users: 2780 },
];

const lineChartData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
];

const pieChartData = [
  { name: "Iphone", value: 400 },
  { name: "Samsung", value: 300 },
  { name: "Xiaomi", value: 300 },
  { name: "Others", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const token=getToken();
const Dashboard = () => {
  const [data, setData] = useState({ users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://backend-h1zl.onrender.com/api/admin/stat/overall",
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        ); // API duy nhất
        const result = await response.json();

        // Cập nhật dữ liệu
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hoàn thành việc tải dữ liệu
      }
    };

    fetchData();
  }, []); // Chỉ gọi API một lần khi component render

  return (
    <Box>
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
        <Box p={3} flex={1}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          {/* Thông tin tóm tắt */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <PeopleIcon /> Users
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {data.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <ShoppingCartIcon /> Orders
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                  {data.totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <AttachMoneyIcon /> Revenue
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                  {data.totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Biểu đồ */}
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6">Monthly Active Users</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6">Monthly Revenue</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="chart-container">
                <Typography variant="h6">Sales by Category</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
