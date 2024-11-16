import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function RequireAuth({ children, requiredRole }) {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      navigate("/login"); // Điều hướng nếu không có token
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userRole = decodedToken.roles;

      if (userRole !== requiredRole) {
        navigate("/not-authorized"); // Điều hướng nếu không đủ quyền
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setDialogOpen(true); // Hiện hộp thoại nếu token không hợp lệ
    }
  }, [navigate, requiredRole]);

  const handleDialogClose = (action) => {
    setDialogOpen(false);
    if (action === "ok") {
      Cookies.remove("accessToken"); // Xóa token không hợp lệ
      navigate("/login"); // Điều hướng tới trang đăng nhập
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={() => handleDialogClose("cancel")}>
        <DialogTitle>Phiên đăng nhập đã hết hạn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Phiên đăng nhập của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại để tiếp tục.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose("cancel")} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose("ok")} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </>
  );
}

export default RequireAuth;
