import React, { useState, useEffect } from "react";
import "../../categoryadmin.css";
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";
import { getToken } from "../../services/Cookies";
import "bootstrap/dist/css/bootstrap.min.css";

const token = getToken();

const AccountsAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ categoryName: "", file: null });


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
   
      const updatedCategory = data.find((item) => item.id === id).name;
    
      // Gửi API cập nhật
    const updateParam = encodeURIComponent(updatedCategory);
    console.log("Update Param:", updateParam);
    fetch(`https://datn.up.railway.app/api/admin/categories/${id}?categoryName=${updateParam}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // Use correct string interpolation
        "Content-Type": "application/json", // Include Content-Type header if needed
      },
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
        console.error("Error:", error);
        alert("Đã xảy ra lỗi!");
      });
  };
  
 
  

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
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
      setData(result.content || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("categoryName", newCategory.categoryName);
    formData.append("file", newCategory.file);

    try {
      const response = await fetch(`https://datn.up.railway.app/api/admin/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Thêm danh mục thành công!");
        setShowModal(false);
        fetchData(currentPage); // Refresh data
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Đã xảy ra lỗi!");
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-lg-2 col-md-3 col-4 p-0 bg-light border-end mt-5">
          <MenuBar />
        </div>
        <div className="col-lg-10 col-md-9 col-8 position-relative p-4">
          {loading && (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          )}
          {!loading && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 mt-6">
                <h2 className="text-primary">Quản lý danh mục</h2>
                <button
                  className="btn btn-success"
                  onClick={() => setShowModal(true)}
                >
                  Thêm mới
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-bordered">
                  <thead className="table-primary">
                    <tr>
                      <th>STT</th>
                      <th>Tên danh mục</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Ngày tạo</th>
                      <th>Hành động</th>
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
                              className="form-control"
                              value={category.name}
                              onChange={(e) =>
                                handleFieldChange(category.id, "name", e.target.value)
                              }
                            />
                          ) : (
                            category.name
                          )}
                        </td>
                        <td>{category.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              category.role === "Admin" ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {category.role}
                          </span>
                        </td>
                        <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td>
                          {editingId === category.id ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleSave(category.id)}
                              >
                                Lưu
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleCancelEdit()}
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEdit(category.id)}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
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
              </div>

              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Trang trước
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      Trang {currentPage + 1} / {totalPages}
                    </span>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === totalPages - 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
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

      {/* Modal for adding a new category */}
      {showModal && (
  <>
    {/* Overlay */}
    <div className="modal-overlay"></div>

    {/* Modal */}
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm danh mục mới</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Tên danh mục
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                value={newCategory.categoryName}
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    categoryName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Hình ảnh
              </label>
              <input
                type="file"
                className="form-control"
                id="file"
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    file: e.target.files[0],
                  }))
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddCategory}
            >
              Thêm mới
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default AccountsAdmin;
