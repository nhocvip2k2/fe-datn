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
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";
import { getToken } from "../../services/Cookies";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const token = getToken();

const Dashboard = () => {
  const [data, setData] = useState({ users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [productPieData, setProductPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://datn.up.railway.app/api/admin/stat/overall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching overall stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/orders?page=0&size=100`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const result = await response.json();
      setOrders(result.content || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductData = async () => {
    try {
      const productCounts = {};
      console.log("Starting fetchProductData...");
      console.log("Orders to process:", orders);
  
      for (const order of orders) {
        const productId = order.productDetail.id;
        console.log(`Processing product ID: ${productId}`);
  
        if (!productCounts[productId]) {
          console.log(`Fetching data for product ID: ${productId}`);
          const response = await fetch(
            `https://datn.up.railway.app/api/admin/products/${productId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
  
          if (!response.ok) {
            console.error(`Failed to fetch product data for ID: ${productId}`);
            continue;
          }
  
          const productData = await response.json();
          console.log(`Fetched product data for ID ${productId}:`, productData);
  
          productCounts[productId] = {
            name: productData.name, // Use productData.name instead of productData.type
            value: 0,
          };
        }
  
        productCounts[productId].value += order.quantity;
        console.log(
          `Updated count for product ID ${productId}:`,
          productCounts[productId]
        );
      }
  
      const productPieData = Object.values(productCounts);
      console.log("Final product pie chart data:", productPieData);
  
      setProductPieData(productPieData);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  

  const processStatusChartData = () => {
    const filteredOrders = orders.filter((order) => order.status === 6);
    const monthlyCounts = {};

    filteredOrders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("en-US", {
        month: "short",
      });
      if (!monthlyCounts[month]) {
        monthlyCounts[month] = 0;
      }
      monthlyCounts[month] += 1;
    });

    const formattedData = Object.entries(monthlyCounts).map(([month, count]) => ({
      name: month,
      orders: count,
    }));

    setStatusChartData(formattedData);
  };

  const processRevenueChartData = () => {
    const monthlyRevenue = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("en-US", {
        month: "short",
      });
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += order.currentPrice;
    });

    const formattedData = Object.entries(monthlyRevenue).map(
      ([month, revenue]) => ({
        name: month,
        revenue,
      })
    );

    setRevenueChartData(formattedData);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      processStatusChartData();
      processRevenueChartData();
      fetchProductData();
    }
  }, [orders]);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-main mt-5">
        <MenuBar />
        <div className="dashboard-content mt-6">
          {/* Cards */}
          <div className="row mb-4">
            <div className="col-12 col-md-4">
              <div className="card">
                <h3>Người dùng</h3>
                <p>{data.totalUsers || 0}</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card">
                <h3>Đơn thuê</h3>
                <p>{data.totalOrders || 0}</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card">
                <h3>Sản phẩm</h3>
                <p>{data.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row">
            {/* Orders with Status 6 */}
           

            {/* Monthly Revenue */}
            <div className="col-12 col-md-6 mb-4">
              <div className="chart-container">
                <div className="chart-title">Doanh thu theo tháng</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="col-12 col-md-6 mb-4">
              <div className="chart-container">
                <div className="chart-title">Thuê nhiều</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productPieData}
                      cx="50%"
                      cy="50%"
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productPieData.map((entry, index) => (
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
      </div>
    </div>
  );
};

export default  Dashboard;
 