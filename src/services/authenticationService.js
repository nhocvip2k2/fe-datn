import { removeToken } from "./Cookies";

export const logOut = () => {
  removeToken();
  localStorage.removeItem("cart"); // Xóa dữ liệu giỏ hàng
};
