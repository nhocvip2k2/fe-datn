import React, { useState, useEffect } from 'react';
import '../../AddProducts.css';
import { getToken } from "../../services/Cookies";
import Header from '../header/Header';
import MenuBar from '../menu/MenuBar';

const ProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    basePrice: '',
    barcode: '',
    quantity: '',
    category: '',
    tags: [],
    images: [],
  });

  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://datn.up.railway.app/api/admin/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
         console.log(data);
        setCategories(data.content || []); // Assuming the API returns a paginated `content` array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagChange = (tag) => {
    setProductData((prevData) => ({
      ...prevData,
      tags: prevData.tags.includes(tag)
        ? prevData.tags.filter((t) => t !== tag)
        : [...prevData.tags, tag],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare form data
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('brand', productData.brand); // Add a brand field
    formData.append('categoryId', productData.category); // Add category ID
    if (productData.images.length > 0) {
      formData.append('file', productData.images[0]); // Send only the first image
    }
  
    try {
      const response = await fetch('https://datn.up.railway.app/api/admin/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`, // Do not set 'Content-Type', fetch will handle it
        },
        body: formData,
      });
  
      if (response.ok) {
        alert('Product added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };
  

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row d-flex">
          {/* MenuBar placed side by side with the form */}
          <div className="col-3">
            <MenuBar />
          </div>
          <div className="col-9">
            <div className="container my-5">
              <h2 className="text-center mb-4">Add New Product</h2>
              <form className="p-4 shadow-sm bg-light rounded" onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}

                {/* General Information */}
                <div className="mb-4">
                  <h4>General Information</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Enter product name"
                      value={productData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="Enter product description"
                      value={productData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <h4>Pricing</h4>
                  <div className="form-group">
                    <label htmlFor="basePrice">Base Price</label>
                    <input
                      type="number"
                      id="basePrice"
                      name="basePrice"
                      className="form-control"
                      placeholder="Enter base price"
                      value={productData.basePrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Inventory */}
                <div className="mb-4">
                  <h4>Inventory</h4>
                  <div className="form-group mb-3">
                    <label htmlFor="barcode">Barcode</label>
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      className="form-control"
                      placeholder="Enter barcode"
                      value={productData.barcode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      className="form-control"
                      placeholder="Enter quantity"
                      value={productData.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                  <h4>Category</h4>
                  <div className="form-group">
                    <label htmlFor="category">Product Category</label>
                    {loading ? (
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={productData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <h5>Tags</h5>
                  <div className="form-check-inline">
                    {['Clothing', 'Toys', 'Internet Of Things', 'Books & Stationaries', 'Art Supplies'].map((tag) => (
                      <div key={tag} className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id={tag}
                          className="form-check-input"
                          checked={productData.tags.includes(tag)}
                          onChange={() => handleTagChange(tag)}
                        />
                        <label htmlFor={tag} className="form-check-label">{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Media */}
                <div className="mb-4">
                  <h4>Product Media</h4>
                  <div className="form-group">
                    <label htmlFor="images">Upload Images</label>
                    <input
                      type="file"
                      id="images"
                      className="form-control"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div className="mt-3">
                    {productData.images.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="img-thumbnail mr-2"
                        style={{ maxHeight: '100px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
