import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../DashBoard.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

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
const token = getToken();

const Dashboard = () => {
  const [data, setData] = useState({ users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://datn.up.railway.app/api/admin/stat/overall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header />

      <div className="dashboard-main">
        {/* MenuBar */}
        <MenuBar />

        {/* Nội dung chính */}
        <div className="dashboard-content">
          {/* Cards hiển thị thông tin tổng quan */}
          <div className="card">
            <h3>Users</h3>
            <p>{data.totalUsers || 0}</p>
          </div>
          <div className="card">
            <h3>Orders</h3>
            <p>{data.totalOrders || 0}</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>${data.revenue || 0}</p>
          </div>

          {/* Biểu đồ */}
          <div className="chart-container">
            <div className="chart-title">Monthly Active Users</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <div className="chart-title">Monthly Revenue</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <div className="chart-title">Sales by Category</div>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
