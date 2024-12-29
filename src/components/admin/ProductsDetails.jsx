import React, { useState, useEffect } from "react";
import "../../ProductsDetails.css";
import MenuBar from "../menu/MenuBar";
import Header from "../header/Header";
import { getToken } from "../../services/Cookies";
import { useParams } from "react-router-dom";

const token = getToken();

const ProductsDetails = () => {
  const { method } = useParams();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    brand: "",
    description: "",
    categoryId: "",
  });
  const [newVariant, setNewVariant] = useState({
    color: "",
    type: "",
    price: "",
    deposit: "",
    inventory: "",
    status: true,
  });
  const [productDetails, setProductDetails] = useState([]);
  const [image, setImage] = useState(null);

  // Lấy danh mục
  useEffect(() => {
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
        const result = await response.json();
        setCategories(result.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Lấy chi tiết sản phẩm nếu đang ở chế độ xem hoặc sửa
  useEffect(() => {
    if (method === "view" || method === "edit") {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://datn.up.railway.app/api/admin/products/${productId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = await response.json();
          setProduct(result);
          setFormValues({
            name: result.name,
            brand: result.brand,
            description: result.description,
            categoryId: result.category.id,
          });
          setImage(result.file); // Gắn hình ảnh sản phẩm
          setProductDetails(result.productDetails || []);
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (method === "add") {
      setLoading(false);
    }
  }, [method, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setProductDetails((prev) => [...prev, newVariant]);
    setNewVariant({
      color: "",
      type: "",
      price: "",
      deposit: "",
      inventory: "",
      status: true,
    });
  };

  const deleteVariant = (index) => {
    const updatedVariants = productDetails.filter((_, i) => i !== index);
    setProductDetails(updatedVariants);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const productData = {
      name: formValues.name,
      brand: formValues.brand,
      description: formValues.description,
      categoryId: formValues.categoryId,
      file: image,
    };

    const url =
      method === "add"
        ? "https://datn.up.railway.app/api/admin/products"
        : `https://datn.up.railway.app/api/admin/products/${productId}`;

    const fetchMethod = method === "add" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: fetchMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");
      const productResponse = await response.json();
      alert(`${method === "add" ? "Thêm" : "Cập nhật"} sản phẩm thành công`);

      if (productResponse.id) {
        await handleSubmitVariants(productResponse.id);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleSubmitVariants = async (productId) => {
    if (productDetails.length === 0) return;

    const variantsData = productDetails.map((variant) => ({
      color: variant.color,
      type: variant.type,
      price: variant.price,
      deposit: variant.deposit,
      inventory: variant.inventory,
      status: variant.status,
    }));

    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/products/${productId}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ variants: variantsData }),
        }
      );

      if (!response.ok) throw new Error("Failed to save variants");
      alert("Biến thể sản phẩm đã được thêm thành công!");
    } catch (error) {
      console.error("Error saving variants:", error);
      alert("Đã xảy ra lỗi khi lưu biến thể. Vui lòng thử lại.");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="productsdetails-container">
      <Header />
      <div className="productsdetails-main">
        <MenuBar />
        <div className="productsdetails-content">
          <form onSubmit={handleSubmitProduct} className="product-form">
            <h2>
              {method === "view"
                ? "Thông tin sản phẩm"
                : method === "add"
                ? "Thêm sản phẩm"
                : "Chỉnh sửa sản phẩm"}
            </h2>
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                readOnly={method === "view"}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="brand">Thương hiệu:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formValues.brand}
                onChange={handleChange}
                readOnly={method === "view"}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả:</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                readOnly={method === "view"}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryId">Danh mục:</label>
              {method === "view" ? (
                <input
                  type="text"
                  value={
                    categories.find((cat) => cat.id === formValues.categoryId)
                      ?.name || ""
                  }
                  readOnly
                  className="form-control"
                />
              ) : (
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formValues.categoryId}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Hình ảnh sản phẩm hiện tại:</label>
              {image || (product && product.file) ? (
                <img
                  src={image || product.thumbnail.url}
                  alt="Product"
                  className="product-image-preview"
                  style={{ maxWidth: "200px", marginBottom: "10px" }}
                />
              ) : (
                <p>Không có hình ảnh nào.</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="file">Chọn hình ảnh:</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleImageChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <h3>Danh sách Biến thể sản phẩm</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Màu sắc</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Đặt cọc</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.color}</td>
                      <td>{detail.type}</td>
                      <td>{detail.price}</td>
                      <td>{detail.deposit}</td>
                      <td>{detail.inventory}</td>
                      <td>{detail.status ? "Còn hàng" : "Hết hàng"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteVariant(index)}
                          className="btn-delete"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {method !== "view" && (
                <div className="form-group">
                  <h4>Thêm biến thể sản phẩm</h4>
                  <input
                    type="text"
                    name="color"
                    value={newVariant.color}
                    onChange={handleVariantChange}
                    placeholder="Màu sắc"
                    className="form-control"
                  />
                  <input
                    type="text"
                    name="type"
                    value={newVariant.type}
                    onChange={handleVariantChange}
                    placeholder="Loại"
                    className="form-control"
                  />
                  <input
                    type="number"
                    name="price"
                    value={newVariant.price}
                    onChange={handleVariantChange}
                    placeholder="Giá"
                    className="form-control"
                  />
                  <input
                    type="number"
                    name="deposit"
                    value={newVariant.deposit}
                    onChange={handleVariantChange}
                    placeholder="Đặt cọc"
                    className="form-control"
                  />
                  <input
                    type="number"
                    name="inventory"
                    value={newVariant.inventory}
                    onChange={handleVariantChange}
                    placeholder="Tồn kho"
                    className="form-control"
                  />
                  <select
                    name="status"
                    value={newVariant.status}
                    onChange={handleVariantChange}
                    className="form-control"
                  >
                    <option value={true}>Còn hàng</option>
                    <option value={false}>Hết hàng</option>
                  </select>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="btn-submit"
                  >
                    Thêm biến thể
                  </button>
                </div>
              )}
            </div>
            {method !== "view" && (
              <button type="submit" className="btn-submit">
                {method === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;
