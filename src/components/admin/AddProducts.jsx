import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import "../../AddProducts.css";
import { getToken } from "../../services/Cookies";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    brand: "",
    description: "",
    name: "",
    categoryId: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = new FormData();
    form.append("brand", formData.brand);
    form.append("description", formData.description);
    form.append("name", formData.name);
    form.append("categoryId", formData.categoryId);
    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      const response = await fetch("https://datn.up.railway.app/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      const data = await response.json();
      setMessage("Product added successfully!");
      setFormData({ brand: "", description: "", name: "", categoryId: "", file: null });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Brand"
          name="brand"
          fullWidth
          margin="normal"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />
        <TextField
          label="Product Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Category ID"
          name="categoryId"
          type="number"
          fullWidth
          margin="normal"
          value={formData.categoryId}
          onChange={handleChange}
        />
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Upload File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
        </Button>
      </form>
      {message && (
        <Typography
          variant="body1"
          textAlign="center"
          color={message.includes("successfully") ? "green" : "red"}
          sx={{ marginTop: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AddProduct;
