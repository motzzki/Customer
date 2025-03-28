import React from "react";
import CardDivision from "../components/CardDivision";
import AdminNav from "../components/AdminNav";

const AdminDashboard = () => {
  return (
    <>
      <div className="admin-bg">
        <AdminNav />
        <CardDivision />
      </div>
    </>
  );
};

export default AdminDashboard;
