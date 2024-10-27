import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/localStorageService";
import Header from "./header/Header";
import MenuBar from "./menu/MenuBar";
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

  const getUsers = async (accessToken) => {
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);

      setUsers(data.result);
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
    setEditUser({ ...user, isactive: user.isactive === "true" });
    handleCloseMenu();
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${selectedUserId}`, {
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
          position: { name: editUser.position },
          branch: { name: editUser.branch },
          type: editUser.type,
          startdate: editUser.startdate,
          salary: editUser.salary,
          level: editUser.level,
          salaryat: editUser.salaryat,
          address: editUser.address,
          phone: editUser.phone,
          stopdate: editUser.stopdate,
          basicTrainer: { id: editUser.basicTrainer },
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
          branch: { name: searchParams.branch },
          type: searchParams.type,
          level: searchParams.level,
          isactive: searchParams.isactive,
          position: { name: searchParams.position },
          basicTrainer: { name: searchParams.basicTrainer },
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
      <Box display="flex" flexDirection="row" height="100vh" bgcolor="#f0f2f5" marginTop={6}>
        <MenuBar />
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
        <InputLabel id="branch-label">Branch</InputLabel>
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
          <MenuItem value="HN1">HN1</MenuItem>
          <MenuItem value="SG2">SG2</MenuItem>
          <MenuItem value="HN2">HN2</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          name="type"
          value={searchParams.type}
          onChange={handleSearchChange}
          label="Type"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="intern">Intern</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="HN2">HN2</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="level-label">Level</InputLabel>
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
          <MenuItem value="intern 0">Intern 0</MenuItem>
          <MenuItem value="SG2">SG2</MenuItem>
          <MenuItem value="HN2">HN2</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="position-label">Position</InputLabel>
        <Select
          labelId="position-label"
          name="position"
          value={searchParams.position}
          onChange={handleSearchChange}
          label="Position"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="SG2">SG2</MenuItem>
          <MenuItem value="HN2">HN2</MenuItem>
          {/* Thêm các tùy chọn khác tại đây */}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="basicTrainer-label">Basic Trainer</InputLabel>
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
          <MenuItem value="hung">Hung</MenuItem>
          <MenuItem value="SG2">SG2</MenuItem>
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
                    <TableCell>Position</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Salary At</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Basic Trainer</TableCell>
                    <TableCell>Roles</TableCell>
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
                        <TableCell >{user.username}<br></br>{user.email}</TableCell>
                        <TableCell>{user.sex}</TableCell>
                        <TableCell>{user.position ? user.position.name : ''}</TableCell>
                        <TableCell>{user.branch ? user.branch.name : ''}</TableCell>
                        <TableCell>{user.type}</TableCell>
                        <TableCell>{user.salary}</TableCell>
                        <TableCell>{user.level}</TableCell>
                        <TableCell>{user.salaryat}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.basicTrainer ? user.basicTrainer.name : ''}</TableCell>
                        <TableCell> {user.roles.map(role => role.name)}</TableCell>
                        <TableCell>
                          <Checkbox checked={user.isactive} disabled />
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
              value={editUser.firstName}
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
              label="Last Name"
              name="lastName"
              value={editUser.lastName}
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
              label="Position"
              name="position"
              value={editUser.position}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Branch"
              name="branch"
              value={editUser.branch}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Type"
              name="type"
              value={editUser.type}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Start Date"
              name="startdate"
              value={editUser.startdate}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={editUser.salary}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Level"
              name="level"
              value={editUser.level}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Salary At"
              name="salaryat"
              value={editUser.salaryat}
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
              label="Stop Date"
              name="stopdate"
              value={editUser.stopdate}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Basic Trainer"
              name="basicTrainer"
              value={editUser.basicTrainer}
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
