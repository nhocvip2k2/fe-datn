import { removeToken } from "./Cookies";

export const logOut = () => {
  removeToken();
  localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage

};
