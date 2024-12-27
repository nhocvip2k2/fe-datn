import React, { useState, useEffect } from "react";
import "../../AccountsAdmin.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

const token = getToken();

const AccountsAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://datn.up.railway.app/api/admin/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setData(result.users || []); // Lấy danh sách người dùng từ API
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
      <Header />

      <div className="accounts-main">
        <MenuBar />

        <div className="accounts-content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsAdmin;
