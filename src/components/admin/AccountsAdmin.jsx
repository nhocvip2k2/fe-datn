import React, { useState, useEffect } from "react";
import "../../AccountsAdmin.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

const token = getToken();

const AccountsAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/users?page=${page}&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      setData(result.content || []); // Lấy danh sách người dùng từ API
      setTotalPages(result.totalPages || 1); // Lấy tổng số trang từ API
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="accounts-container">
      <Header />

      <div className="accounts-main">
        <MenuBar />

        <div className="accounts-content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="accounts-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1 + currentPage * 10}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Thanh phân trang */}
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Trang trước
                </button>
                <span>
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsAdmin;
