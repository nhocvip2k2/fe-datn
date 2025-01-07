import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import MenuBar from "../menu/MenuBar";
import { getToken } from "../../services/Cookies";

const Revenue = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = getToken();

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://datn.up.railway.app/api/admin/stat/revenue?startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch revenue data");

      const data = await response.json();
      setRevenue(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError("Không thể tải dữ liệu doanh số.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchRevenue();
    } else {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-lg-2 col-md-3 bg-light p-0">
          <MenuBar />
        </div>
        <div className="col-lg-10 col-md-9 p-4" 
        style={{
          marginTop:100,
        }}>
          <h2 className="mb-4">Thống kê doanh thu</h2>

          {/* Bộ lọc ngày */}
          <div className="mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleSearch}>
                  Xem doanh số
                </button>
              </div>
            </div>
          </div>

          {/* Hiển thị trạng thái */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            revenue && (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Ngày</th>
                      <th>Doanh số (VNĐ)</th>
                      <th>Số đơn hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.revenues.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.date}</td>
                        <td>{item.revenue.toLocaleString()}đ</td>
                        <td>{item.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-secondary">
                      <td colSpan="2"><strong>Tổng cộng</strong></td>
                      <td><strong>{revenue.totalRevenue.toLocaleString()}đ</strong></td>
                      <td><strong>{revenue.totalOrders}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
