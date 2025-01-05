import React, { useState, useEffect } from "react";
import "../../AccountsAdmin.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="container-fluid">
      <Header />
      <div className="row">
        {/* MenuBar */}
        <div className="col-lg-2 col-md-3 col-4 p-0 bg-light border-end mt-5">
          <MenuBar />
        </div>
  
        {/* Nội dung chính */}
        <div className="col-lg-10 col-md-9 col-8 p-4 mt-6 ">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-primary">Danh sách người dùng</h2>
              <div className="table-responsive">
                <table className="table table-hover table-striped table-bordered">
                  <thead className="table-primary">
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
                        <td>
                          <span
                            className={`badge ${
                              user.role === "Admin" ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Thanh phân trang */}
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Trang trước
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      Trang {currentPage + 1} / {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Trang sau
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
}  

export default AccountsAdmin;
