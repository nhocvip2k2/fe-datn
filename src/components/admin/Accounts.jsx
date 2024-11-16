import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/Cookies";
import Header from "../header/Header";
import Sidebar from "../menu/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FormControl,
  InputLabel,
  Table,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  CircularProgress,
  Typography,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Checkbox,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select
} from "@mui/material";

export default function ListUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Thêm state để quản lý trạng thái của MenuBar

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  // Thêm các state cho tìm kiếm
  const [searchParams, setSearchParams] = useState({
    username: "",
    email: "",
    branch: "",
    type: "",
    level: "",
    isactive: "",
    position: "",
    basicTrainer: "",
  });

  const getUsers = async () => {
    try {
      const response = await fetch("https://backend-h1zl.onrender.com/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);

      setUsers(data.content);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEditUser = (user) => {
    setEditUser({...user, isactive: user.isactive === "true" });
    handleCloseMenu();
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`https://backend-h1zl.onrender.com/api/home/user_id=${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
       },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedUsers = users.filter((user) => user.id !== selectedUserId);
      setUsers(updatedUsers);

      setDeleteSuccess(true);
      navigate("/ListUsers");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      setError(error.message);
    } finally {
      handleCloseMenu();
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          firstName: editUser.firstName,
          password: editUser.password,
          lastName: editUser.lastName,
          email: editUser.email,
          sex: editUser.sex,
          address: editUser.address,
          phone: editUser.phone,
          roles: [editUser.role],
          isactive: editUser.isactive.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedUsers = users.map((user) =>
        user.id === editUser.id ? editUser : user
      );
      setUsers(updatedUsers);
      setEditUser(null);
      setEditSuccess(true);
    } catch (error) {
      console.error("Error saving user:", error.message);
      setError(error.message);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/searchusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          username: searchParams.username,
          email: searchParams.email,
          sex: searchParams.sex,
          isactive: searchParams.isactive,
          address: { name: searchParams.address },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setUsers(data.result);
      setError(null);
    } catch (error) {
      console.error("Error searching users:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    const accessToken = getToken();

    if (!accessToken) {
      navigate("/login");
    } else {
      getUsers(accessToken);
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (deleteSuccess) {
      timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [deleteSuccess]);

  useEffect(() => {
    if (editSuccess) {
      const accessToken = getToken();
      getUsers(accessToken);
      setEditSuccess(false);
    }
  }, [editSuccess]);

  return (
    <>
      <Header />

      <Box display="flex" marginTop={8}>
        {/* Sidebar */}
        <Sidebar />

        {/* Nội dung chính */}
        
        {error ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Typography variant="h5" color="error">
              Error: {error}
            </Typography>
          </Box>
        ) : (
          <Box flex={1} p={2}>
            {/* Các ô tìm kiếm */}
            <Box mb={2}>
              <TextField
                label="Username"
                name="username"
                value={searchParams.username}
                onChange={handleSearchChange}
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={searchParams.email}
                onChange={handleSearchChange}
                margin="normal"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 } } marginTop={2}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="branch-label">Sex</InputLabel>
        <Select
          labelId="branch-label"
          name="branch"
          value={searchParams.branch}
          onChange={handleSearchChange}
          label="Branch"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="level-label">Role</InputLabel>
        <Select
          labelId="level-label"
          name="level"
          value={searchParams.level}
          onChange={handleSearchChange}
          label="Level"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="SG2">Customer</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="basicTrainer-label">Address</InputLabel>
        <Select
          labelId="basicTrainer-label"
          name="basicTrainer"
          value={searchParams.basicTrainer}
          onChange={handleSearchChange}
          label="Basic Trainer"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="HN">HN</MenuItem>
          <MenuItem value="ND">ND</MenuItem>
          <MenuItem value="HN2">HN2</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="isactive-label">IsActive</InputLabel>
        <Select
          labelId="isactive-label"
          name="isactive"
          value={searchParams.isactive}
          onChange={handleSearchChange}
          label="IsActive"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>
    </Box>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearchUsers}
              >
                Search
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Sex</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Creation Date</TableCell>
                    <TableCell>Update Date</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={20} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        {/* <TableCell>{user.id}</TableCell> */}
                        <TableCell >{user.name}<br></br>{user.email}</TableCell>
                        <TableCell>{user.sex}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell> {user.role}</TableCell>
                        <TableCell> {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                        <TableCell> {format(new Date(user.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                        <TableCell>
                          <Checkbox checked={user.status} disabled />
                        </TableCell>
                        <TableCell>
                          <Button
                            aria-controls="action-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleActionClick(event, user.id)}
                          >
                            Actions
                          </Button>
                          <Menu
                            id="action-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem onClick={() => handleEditUser(user)}>Edit</MenuItem>
                            <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Snackbar
              open={deleteSuccess}
              autoHideDuration={3000}
              message="User deleted successfully"
            />
          </Box>
        )}
      </Box>

      {editUser && (
        <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              name="firstName"
              value={editUser.name}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={editUser.password}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={editUser.email}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Sex"
              name="sex"
              value={editUser.sex}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            
            <TextField
              label="Address"
              name="address"
              value={editUser.address}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={editUser.phone}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={editUser.role}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Checkbox
              name="isactive"
              checked={editUser.isactive}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
