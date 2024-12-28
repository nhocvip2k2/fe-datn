import React, { useState, useEffect } from "react";
import "../../categoryadmin.css";
import MenuBar from "../menu/MenuBar"; // Thanh MenuBar có sẵn
import Header from "../header/Header"; // Header có sẵn
import { getToken } from "../../services/Cookies";

const token = getToken();

const AccountsAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [editingId, setEditingId] = useState(null); // Hàng đang được chỉnh sửa

const handleEdit = (id) => {
  setEditingId(id);
};

const handleCancelEdit = () => {
  setEditingId(null);
};

const handleFieldChange = (id, field, value) => {
  setData((prevData) =>
    prevData.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
  );
};

const handleSave = (id) => {
  const updatedCategory = data.find((item) => item.id === id);

  // Gửi API cập nhật
  fetch(`https://datn.up.railway.app/api/admin/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedCategory),
  })
    .then((response) => {
      if (response.ok) {
        alert("Cập nhật thành công!");
        setEditingId(null);
      } else {
        alert("Có lỗi xảy ra!");
      }
    })
    .catch((error) => {
      console.error("Error updating category:", error);
    });
};

const handleDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
    // Gửi API xóa
    fetch(`https://datn.up.railway.app/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Xóa thành công!");
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          alert("Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  }
};


  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/categories?page=${page}&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      setData(result.content || []); // 
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
    <div className="categoryadmin-container">
      <Header />

      <div className="categoryadmin-main">
        <MenuBar />

        <div className="categoryadmin-content">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <>
              <table className="categoryadmin-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên danh mục</th>
                    <th>Hình ảnh </th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
  {data.map((category, index) => (
    <tr key={category.id}>
      <td>{index + 1 + currentPage * 10}</td>
      <td>
        {editingId === category.id ? (
          <input
            type="text"
            value={category.name}
            onChange={(e) =>
              handleFieldChange(category.id, "name", e.target.value)
            }
          />
        ) : (
          category.name
        )}
      </td>
      <td>
        {editingId === category.id ? (
          <input
            type="email"
            value={category.email}
            onChange={(e) =>
              handleFieldChange(category.id, "email", e.target.value)
            }
          />
        ) : (
          category.email
        )}
      </td>
      <td>{category.role}</td>
      <td>{new Date(category.createdAt).toLocaleDateString()}</td>
      <td>
        {editingId === category.id ? (
          <>
            <button
              className="btn-save"
              onClick={() => handleSave(category.id)}
            >
              Lưu
            </button>
            <button
              className="btn-cancel"
              onClick={() => handleCancelEdit()}
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-edit"
              onClick={() => handleEdit(category.id)}
            >
              Sửa
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDelete(category.id)}
            >
              Xóa
            </button>
          </>
        )}
      </td>
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
