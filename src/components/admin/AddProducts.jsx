import React, { useState } from 'react';
import '../../AddProducts.css';
import { getToken } from "../../services/Cookies";
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
    try {
      const response = await fetch('https://datn.up.railway.app/api/admin/products', {
        method: 'POST',
        headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully!');
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>General Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="form-section">
        <h3>Pricing</h3>
        <input
          type="number"
          name="basePrice"
          placeholder="Base Price"
          value={productData.basePrice}
          onChange={handleInputChange}
        />
       
      </div>

      <div className="form-section">
        <h3>Inventory</h3>
        <input
          type="text"
          name="barcode"
          placeholder="Barcode"
          value={productData.barcode}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={productData.quantity}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-section">
        <h3>Category</h3>
        <input
          type="text"
          name="category"
          placeholder="Product Category"
          value={productData.category}
          onChange={handleInputChange}
        />
        <div className="tags">
          {['Clothing', 'Toys', 'Internet Of Things', 'Books & Stationaries', 'Art Supplies'].map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                checked={productData.tags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Product Media</h3>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="image-preview">
          {productData.images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
