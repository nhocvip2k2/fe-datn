import Cookies from "js-cookie";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  // Kiểm tra token để điều hướng nếu đã đăng nhập
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/home");
    }
  }, [navigate]);

  // State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("error"); // error hoặc success

  const handleSubmit = (event) => {
    event.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setSnackBarMessage("Mật khẩu không trùng khớp. Vui lòng kiểm tra lại.");
      setSnackBarSeverity("error");
      setSnackBarOpen(true);
      return;
    }

    // Gửi yêu cầu đăng ký
    fetch("https://datn.up.railway.app/api/home/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
        role: "customer",
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          // Thành công
          setSnackBarMessage("Đăng ký thành công. Về đăng nhập");
          setSnackBarSeverity("success");
          setSnackBarOpen(true);

          // Chờ 3 giây rồi điều hướng
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // Thất bại (API trả về lỗi)
          const errorMessage = data.message || "Đăng ký thất bại. Vui lòng thử lại.";
          setSnackBarMessage(errorMessage);
          setSnackBarSeverity("error");
          setSnackBarOpen(true);
        }
      })
      .catch((err) => {
        // Lỗi mạng hoặc lỗi không mong muốn
        console.error("Network error:", err);
        setSnackBarMessage("Đã xảy ra lỗi mạng. Vui lòng thử lại.");
        setSnackBarSeverity("error");
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      {/* Snackbar thông báo */}
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBarSeverity} // Dựa trên trạng thái
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>

      {/* Form đăng ký */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor={"#f0f2f5"}
      >
        <Card
          sx={{
            minWidth: 400,
            maxWidth: 500,
            boxShadow: 4,
            borderRadius: 4,
            padding: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Welcome
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: "15px",
                  mb: "25px",
                }}
              >
                Đăng Ký
              </Button>
              <Divider />
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ mt: 2, cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Đã có tài khoản ? <strong>Đăng nhập</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
