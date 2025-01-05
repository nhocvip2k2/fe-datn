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
      setImage(file);
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

  const updateVariant = (index, field, value) => {
    setProductDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  
  const deleteVariant = (index) => {
    const updatedVariants = productDetails.filter((_, i) => i !== index);
    setProductDetails(updatedVariants);
  };
  

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
  
    const isAdding = method === "add";
    const url = isAdding
      ? "https://datn.up.railway.app/api/admin/products"
      : `https://datn.up.railway.app/api/admin/products/${productId}`;
    const fetchMethod = isAdding ? "POST" : "PUT";
  
    try {
      // Xử lý sản phẩm chính
      if (isAdding) {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("brand", formValues.brand);
        formData.append("description", formValues.description);
        formData.append("categoryId", formValues.categoryId);
        if (image) formData.append("file", image);
  
        const response = await fetch(url, {
          method: fetchMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
  
        if (!response.ok) throw new Error("Failed to save product");
        const productResponse = await response.json();
        await handleSubmitVariants(productResponse.id); // Gửi biến thể
        alert("Thêm sản phẩm và biến thể thành công");
      } else {
        const productData = {
          newName: formValues.name,
          newBrand: formValues.brand,
          newDescription: formValues.description,
          newCategoryId: formValues.categoryId,
        };
  
        const response = await fetch(url, {
          method: fetchMethod,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) throw new Error("Failed to update product");
        await handleSubmitVariants(productId); // Gửi biến thể
        alert("Cập nhật sản phẩm và biến thể thành công");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  
const handleSubmitVariants = async (productId) => {
  if (productDetails.length === 0) return;

  try {
    for (const variant of productDetails) {
      const variantData = {
        color: variant.color,
        type: variant.type,
        price: variant.price,
        deposit: variant.deposit,
        inventory: variant.inventory,
        condition: variant.condition,
        status: variant.status,
      };

      if (variant.id) {
        // Nếu đã có ID, cập nhật
        const response = await fetch(
          `https://datn.up.railway.app/api/admin/product_details/${variant.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(variantData),
          }
        );
        if (!response.ok) throw new Error("Failed to update variant");
      } else {
        // Nếu chưa có ID, thêm mới
        const response = await fetch(
          `https://datn.up.railway.app/api/admin/products/${productId}/product_details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(variantData),
          }
        );
        if (!response.ok) throw new Error("Failed to add new variant");
      }
    }
  } catch (error) {
    console.error("Error updating variants:", error);
    alert("Đã xảy ra lỗi khi cập nhật biến thể. Vui lòng thử lại.");
  }
};

  return (
    <div className="container-fluid">
      <Header />
      <div
        className="row mt-4"
        style={{ minHeight: "calc(100vh - 60px)" }} // Đảm bảo chiều cao tối thiểu trừ Header
      >
        {/* MenuBar */}
        <div className="col-lg-2 col-md-3 p-0 d-flex">
          <div className="bg-light w-100 d-flex flex-column h-100 mt-5">
            <MenuBar />
          </div>
        </div>
  
        {/* Nội dung chính */}
        <div className="col-lg-10 col-md-9 mt-3">
          <form
            onSubmit={handleSubmitProduct}
            className="bg-white p-4 shadow rounded h-100 d-flex flex-column"
          >
            <h2 className="text-center mb-4">
              {method === "view"
                ? "Thông tin sản phẩm"
                : method === "add"
                ? "Thêm sản phẩm"
                : "Chỉnh sửa sản phẩm"}
            </h2>
  
            {/* Tên sản phẩm */}
            <div className="row mb-3">
  {/* Tên sản phẩm */}
  <div className="col-md-6">
    <label htmlFor="name" className="form-label">
      Tên sản phẩm:
    </label>
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

  {/* Thương hiệu */}
  <div className="col-md-6">
    <label htmlFor="brand" className="form-label">
      Thương hiệu:
    </label>
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
</div>

  
            {/* Mô tả */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Mô tả:
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                readOnly={method === "view"}
                className="form-control"
                rows="3"
              />
            </div>
  
            {/* Danh mục */}
            <div className="mb-3">
              <label htmlFor="categoryId" className="form-label">
                Danh mục:
              </label>
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
                  className="form-select"
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
  
            {/* Hình ảnh */}
            <div className="mb-3">
              <label className="form-label">Hình ảnh sản phẩm hiện tại:</label>
              {image || (product && product.thumbnail?.url) ? (
    <img
      src={image || product.thumbnail?.url}
      alt="Product"
      className="img-thumbnail mb-3"
      style={{ maxWidth: "200px" }}
    />
  ) : (
    <p>Không có hình ảnh nào.</p>
  )}
              <label htmlFor="file" className="form-label">
                Chọn hình ảnh:
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleImageChange}
                className="form-control"
              />
            </div>
  
            {/* Biến thể */}
            <div className="mb-3">
  <h4>Danh sách Biến thể sản phẩm</h4>
  <table className="table table-bordered">
  <thead className="table-light">
    <tr>
      <th>Màu sắc</th>
      <th>Loại</th>
      <th>Giá</th>
      <th>Đặt cọc</th>
      <th>Tồn kho</th>
      <th>Điều kiện</th>
      <th>Trạng thái</th>
      <th>Hành động</th>
    </tr>
  </thead>
  <tbody>
    {productDetails.map((detail, index) => (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={detail.color}
            onChange={(e) => updateVariant(index, "color", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={detail.type}
            onChange={(e) => updateVariant(index, "type", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <input
            type="number"
            value={detail.price}
            onChange={(e) => updateVariant(index, "price", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <input
            type="number"
            value={detail.deposit}
            onChange={(e) => updateVariant(index, "deposit", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <input
            type="number"
            value={detail.inventory}
            onChange={(e) => updateVariant(index, "inventory", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={detail.condition}
            onChange={(e) => updateVariant(index, "condition", e.target.value)}
            className="form-control"
          />
        </td>
        <td>
          <select
            value={detail.status}
            onChange={(e) => updateVariant(index, "status", e.target.value)}
            className="form-select"
          >
            <option value={true}>Còn hàng</option>
            <option value={false}>Hết hàng</option>
          </select>
        </td>
        <td>
          <button
            type="button"
            onClick={() => deleteVariant(index)}
            className="btn btn-danger btn-sm"
          >
            Xóa
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  {/* Thêm biến thể mới */}
  {/* <div className="row g-3">
    <div className="col-md-6">
      <input
        type="text"
        name="color"
        value={newVariant.color}
        onChange={handleVariantChange}
        placeholder="Màu sắc"
        className="form-control"
      />
    </div>
    <div className="col-md-6">
      <input
        type="text"
        name="type"
        value={newVariant.type}
        onChange={handleVariantChange}
        placeholder="Loại"
        className="form-control"
      />
    </div>
    <div className="col-md-4">
      <input
        type="number"
        name="price"
        value={newVariant.price}
        onChange={handleVariantChange}
        placeholder="Giá"
        className="form-control"
      />
    </div>
    <div className="col-md-4">
      <input
        type="number"
        name="deposit"
        value={newVariant.deposit}
        onChange={handleVariantChange}
        placeholder="Đặt cọc"
        className="form-control"
      />
    </div>
    <div className="col-md-4">
      <input
        type="number"
        name="inventory"
        value={newVariant.inventory}
        onChange={handleVariantChange}
        placeholder="Tồn kho"
        className="form-control"
      />
    </div>
    <div className="col-md-12">
      <select
        name="status"
        value={newVariant.status}
        onChange={handleVariantChange}
        className="form-select"
      >
        <option value={true}>Còn hàng</option>
        <option value={false}>Hết hàng</option>
      </select>
    </div>
    <div className="col-md-12 text-end">
      <button
        type="button"
        onClick={addVariant}
        className="btn btn-primary"
      >
        Thêm biến thể
      </button>
    </div>
  </div> */}
</div>

  
            {/* Nút lưu */}
            {method !== "view" && (
              <button type="submit" className="btn btn-success w-100 ">
                {method === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}  
export default ProductsDetails;
