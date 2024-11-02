import Cookies from "js-cookie";
export const KEY_TOKEN = "accessToken";


export const getToken = () => {
  return Cookies.get(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};
