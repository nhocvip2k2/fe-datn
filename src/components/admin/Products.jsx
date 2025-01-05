import React, { useEffect, useState } from 'react';
import '../../Products.css'; // File CSS
import Header from '../header/Header';
import { getToken } from "../../services/Cookies";
import dayjs from 'dayjs';
import MenuBar from "../menu/MenuBar";
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [data, setData] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const navigate = useNavigate(); // Correct usage

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    barcode: "",
    images: [],
    productDetails: {
      type: "",
      color: "",
      price: "",
      condition: "",
      inventory: "",
    },
  });
  
  const [categories, setCategories] = useState([]);

  const token = getToken();

  const formatDate = (isoDate) => dayjs(isoDate).format("DD/MM/YYYY HH:mm");

  // Fetch products
  const fetchProducts = async (page = 0) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/products?page=${page}&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setData(data.content || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for the modal
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://datn.up.railway.app/api/admin/categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const result = await response.json();
      setCategories(result.content || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Open modal and fetch categories
  const handleAddClick = () => {
    fetchCategories();
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };


  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("categoryId", newProduct.category);
    formData.append("brand", newProduct.brand);
    formData.append("barcode", newProduct.barcode);
    if (newProduct.images.length > 0) {
      formData.append("file", newProduct.images[0]); // Only send the first image
    }
  
    try {
      // Step 1: Create the product
      const productResponse = await fetch(
        "https://datn.up.railway.app/api/admin/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.message || "Failed to create product");
      }
  
      const createdProduct = await productResponse.json();
  
      // Step 2: Create the product detail
      const productDetail = {
        product_id: createdProduct.id, // Use the ID of the newly created product
        ...newProduct.productDetails,
      };
  
      const productDetailResponse = await fetch(
        "https://datn.up.railway.app/api/admin/product_details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productDetail),
        }
      );
  
      if (!productDetailResponse.ok) {
        const errorData = await productDetailResponse.json();
        throw new Error(
          errorData.message || "Failed to create product detail"
        );
      }
  
      alert("Thêm sản phẩm thành công!");
      setShowModal(false);
      fetchProducts(currentPage); // Refresh product list
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);
  // Handlers for navigation
  const handleViewClick = (id) => {
    navigate(`/admin/productsdetails/${id}/view`);
  };

  const handleEditClick = (id) => {
    navigate(`/admin/productsdetails/${id}/edit`);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`https://datn.up.railway.app/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error deleting the product");
          }
          setData(data.filter((item) => item.id !== id)); // Update products list
        })
        .catch((error) => {
          alert("Error deleting the product: " + error.message);
        });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchProducts(newPage); // Fetch products for the new page
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row d-flex ">
          <div className="col-3 mt-5">
            <MenuBar />
          </div>
          <div className="col-9 ">
            <div className="layout-content mt-6">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Danh sách sản phẩm</h4>
                <button
                  className="btn btn-primary"
                  onClick={handleAddClick}
                >
                  Thêm mới
                </button>
              </div>

              {error && <p className="text-danger">Error: {error}</p>}
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Brand</th>
                          <th>Category</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1 + currentPage * 10}</td>
                            <td>
                              <img
                                src={item.thumbnail.url}
                                alt={item.name}
                                className="img-fluid"
                                style={{ maxWidth: "100px" }}
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.brand || "N/A"}</td>
                            <td>{item.category.name || "N/A"}</td>
                            <td>
                              <button
                                className="btn btn-info btn-sm me-2"
                                onClick={() => handleViewClick(item.id)}
                              >
                                View
                              </button>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEditClick(item.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteClick(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="d-flex justify-content-center mt-4">
  <nav>
    <ul className="pagination">
      {/* Previous Button */}
      <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>

      {/* Current Page Info */}
      <li className="page-item disabled">
        <span className="page-link">
          Page {currentPage + 1} of {totalPages}
        </span>
      </li>

      {/* Next Button */}
      <li className={`page-item ${currentPage + 1 === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</div>

                </div>
              )}
            </div>
          </div>
        </div>
        {showModal && (
  <>
    <div className="modal-overlay"></div>
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm sản phẩm mới</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleModalClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Product Information */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Tên sản phẩm
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={newProduct.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="mb-3 row">
  <div className="col-md-6">
    <label htmlFor="brand" className="form-label">
      Thương hiệu
    </label>
    <input
      type="text"
      id="brand"
      name="brand"
      className="form-control"
      value={newProduct.brand}
      onChange={handleInputChange}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="category" className="form-label">
      Danh mục
    </label>
    <select
      id="category"
      name="category"
      className="form-select"
      value={newProduct.category}
      onChange={handleInputChange}
    >
      <option value="">Chọn danh mục</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>
</div>

            <div className="mb-3">
              <label htmlFor="images" className="form-label">
                Hình ảnh
              </label>
              <input
                type="file"
                id="images"
                className="form-control"
                onChange={handleImageUpload}
              />
            </div>

            {/* Product Details */}
            <hr />
            <h6>Thông tin chi tiết sản phẩm</h6>
            <div className="mb-3 row">
  <div className="col-md-6">
    <label htmlFor="type" className="form-label">
      Loại sản phẩm
    </label>
    <input
      type="text"
      id="type"
      name="type"
      className="form-control"
      value={newProduct.productDetails?.type || ""}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          productDetails: { ...prev.productDetails, type: e.target.value },
        }))
      }
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="color" className="form-label">
      Màu sắc
    </label>
    <input
      type="text"
      id="color"
      name="color"
      className="form-control"
      value={newProduct.productDetails?.color || ""}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          productDetails: { ...prev.productDetails, color: e.target.value },
        }))
      }
    />
  </div>
</div>

<div className="mb-3 row">
  <div className="col-md-4">
    <label htmlFor="price" className="form-label">
      Giá sản phẩm
    </label>
    <input
      type="number"
      id="price"
      name="price"
      className="form-control"
      value={newProduct.productDetails?.price || ""}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          productDetails: { ...prev.productDetails, price: e.target.value },
        }))
      }
    />
  </div>
  <div className="col-md-4">
   
  <label htmlFor="condition" className="form-label">
    Tình trạng
  </label>
  <select
    id="condition"
    name="condition"
    className="form-select"
    value={newProduct.productDetails?.condition || ""}
    onChange={(e) =>
      setNewProduct((prev) => ({
        ...prev,
        productDetails: { ...prev.productDetails, condition: e.target.value },
      }))
    }
  >
    <option value="">Tình trạng</option>
    <option value="Còn hàng">Còn hàng</option>
    <option value="Hết hàng">Hết hàng</option>
  </select>
  </div>
  <div className="col-md-4">
    <label htmlFor="inventory" className="form-label">
      Số lượng tồn kho
    </label>
    <input
      type="number"
      id="inventory"
      name="inventory"
      className="form-control"
      value={newProduct.productDetails?.inventory || ""}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          productDetails: { ...prev.productDetails, inventory: e.target.value },
        }))
      }
    />
  </div>
</div>

          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Thêm mới
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleModalClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

      </div>
    </>
  );
};

export default Products;
