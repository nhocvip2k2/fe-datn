import React, { useEffect, useState } from 'react';
import '../../Products.css'; // File CSS đã chỉnh màu sắc
import Header from '../header/Header';
import { getToken } from "../../services/Cookies";
import dayjs from 'dayjs';
import MenuBar from "../menu/MenuBar";
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển hướng

const Products = () => {
  const [data, setData] = useState([]); // State lưu sản phẩm
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State lỗi

  const token = getToken(); // Lấy token từ cookie
  const navigate = useNavigate(); // Hook điều hướng

  const formatDate = (isoDate) => dayjs(isoDate).format('DD/MM/YYYY HH:mm'); // Định dạng ngày

  // Hàm lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          'https://datn.up.railway.app/api/admin/products',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status}`);
        }

        const data = await response.json();
        setData(data.content); // Lưu dữ liệu sản phẩm
      } catch (err) {
        setError(err.message); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Tắt loading
      }
    };

    fetchOrders();
  }, [token]); // Sử dụng token trong mảng dependency

  // Các hàm điều hướng
  const handleViewClick = (id) => {
    navigate(`/product/details/${id}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  const handleEditClick = (id) => {
    navigate(`/edit-product/${id}`); // Điều hướng đến trang chỉnh sửa sản phẩm
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Gọi API xóa sản phẩm (Cần phải có API xóa)
      fetch(`https://datn.up.railway.app/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error deleting the product");
          }
          // Cập nhật lại danh sách sau khi xóa
          setData(data.filter((item) => item.id !== id));
        })
        .catch((error) => {
          alert("Error deleting the product: " + error.message);
        });
    }
  };

  return (
    <>
      <Header />
      <div className="orders-container-admin">
        <MenuBar />
        <div className="layout-content">
          {error && <p>Error: {error}</p>}
          { !error && (
            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.thumbnail.url}
                        alt={item.name}
                        className="product-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.brand || "N/A"}</td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewClick(item.id)}
                      >
                        View
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
