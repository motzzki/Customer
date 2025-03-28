import React from "react";
import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

const AdminLayout = () => {
  return (
    <div>
      <AdminNav />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
