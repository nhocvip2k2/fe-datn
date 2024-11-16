import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from "../services/Cookies";
const ProductDetails = () => {
  // Sử dụng useParams để lấy ID từ URL
  const { id } = useParams(); // Lấy id từ URL, ở đây là :id

  const [product, setProduct] = useState(null); // State để lưu dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading

  // Hàm lấy dữ liệu sản phẩm từ API
  const fetchProductDetails = async () => {
    try {
        const response = await fetch(`https://backend-h1zl.onrender.com/api/admin/product_details/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
           },
          });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProduct(data); // Cập nhật state với dữ liệu sản phẩm
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]); // Khi id thay đổi, gọi lại hàm fetchProductDetails

  // Hiển thị khi đang tải
  if (loading) {
    return <div>Loading...</div>;
  }

  // Hiển thị khi không có dữ liệu
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.color}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
};

export default ProductDetails;
