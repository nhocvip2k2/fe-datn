import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import MenuBar from "../menu/MenuBar";
import { getToken } from "../../services/Cookies";

const Bill = () => {
  const [orderReturn, setOrderReturn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchOrderReturn = async () => {
      try {
        const response = await fetch(
          "https://datn.up.railway.app/api/customer/orderReturns/1",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch order return data");

        const data = await response.json();
        console.log(data)
        setOrderReturn(data);
      } catch (error) {
        console.error("Error fetching order return data:", error);
        setError("Unable to load order return details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderReturn();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-lg-2 col-md-3 bg-light p-0">
          <MenuBar />
        </div>
    
      </div>
    </div>
  );
};

export default Bill;
