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

export default function Login() {
  const navigate = useNavigate();

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1])); // Giải mã payload
      if (decodedToken.roles === "admin") {
        navigate("/admin/Dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("https://datn.up.railway.app/api/home/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Cookies.set("accessToken", data.token, { expires: 7 });
        
        // Giải mã thủ công để lấy vai trò từ payload
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        console.log("Payload:", decodedToken); 
        if (decodedToken.roles === "admin") {
          navigate("/admin/Dashboard");
        } else {
          navigate("/home");
        }
      })
      .catch((error) => {
        setSnackBarMessage("Login failed. Please try again.");
        setSnackBarOpen(true);
      });
  };

  return (
    <>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
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
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Đăng Nhập
              </Button>
              <Divider />
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ mt: 2, cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Chưa có tài khoản ? <strong>Đăng ký ngay</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
