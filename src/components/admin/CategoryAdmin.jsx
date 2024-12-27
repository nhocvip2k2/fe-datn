import React, { useState, useEffect } from "react";
import "../../AccountsAdmin.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

const token = getToken();

const AccountsAdmin = () => {
  const [data, setData] = useState({ users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://datn.up.railway.app/api/admin/accounts",
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
    <div className="accounts-container">
      {/* Header */}
      <Header />

      <div className="accounts-main">
        {/* MenuBar */}
        <MenuBar />

        {/* Nội dung chính */}
        <div className="accounts-content">
         hihi
          </div>
        </div>
      </div>
    
  );
};

export default AccountsAdmin;
