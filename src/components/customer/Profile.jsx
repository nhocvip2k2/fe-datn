import React, { useState, useEffect } from "react";
import "../../profile.css";
import Header from "../header/HeaderUser";
import { getToken } from "../../services/Cookies";  


const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        setError("Token không tồn tại. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://datn.up.railway.app/api/customer/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin. Vui lòng thử lại.");
        }

        const data = await response.json();
        setProfileData(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const token = getToken();

    try {
      const response = await fetch("https://datn.up.railway.app/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu thông tin. Vui lòng thử lại.");
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);

      // Hiển thị thông báo thành công
      setSuccessMessage("Thông tin đã được cập nhật thành công!");
      setTimeout(() => setSuccessMessage(""), 3000); // Ẩn sau 3 giây
    } catch (err) {
      setError(err.message);
    }
  };


  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Thông tin cá nhân</h1>
          <p>Quản lý và cập nhật thông tin tài khoản của bạn.</p>
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
        <div className="profile-card">
          <div className="profile-avatar">
            <img
              src={ ""|| "https://via.placeholder.com/150"}
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <div className="profile-info">
            <form>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </form>
            <div className="actions">
              {!isEditing ? (
                <button
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </button>
              ) : (
                <button
                  className="btn-save"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
