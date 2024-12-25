import React, { useState } from "react";
import "../../ChangePassword.css";
import Header from "../header/HeaderUser";
import { getToken } from "../../services/Cookies";  
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("https://datn.up.railway.app/api/customer/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Đổi mật khẩu không thành công. Vui lòng thử lại.");
      }

      setMessage("Mật khẩu đã được thay đổi thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
    <Header/>
    <div className="change-password-container">
      <h1>Đổi mật khẩu</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handlePasswordChange}>
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Đổi mật khẩu</button>
      </form>
    </div>
    </>
  );
};

export default ChangePassword;
