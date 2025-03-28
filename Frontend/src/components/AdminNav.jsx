import React, { useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavLink,
  NavbarToggle,
  NavbarCollapse,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import navLogo from "../assets/Images/logo.png";

const AdminNav = () => {
  const navigate = useNavigate();
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // // Listen for screen size changes
  // React.useEffect(() => {
  //   const handleResize = () => setIsMobile(window.innerWidth < 768);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  return (
    <Navbar
      expand="lg"
      className="py-3 mb-5"
      style={{ backgroundColor: "#294a70" }}
    >
      <Container>
        <NavbarBrand className="d-flex align-items-center gap-2">
          <img
            src={navLogo}
            width="100"
            height="100"
            alt="SDO CABUYAO Logo"
            className="img-fluid"
          />
          <span className="fw-bold fs-3 text-light">SDO CABUYAO</span>
        </NavbarBrand>
        <NavbarToggle aria-controls="admin-navbar-nav" />
        <NavbarCollapse id="admin-navbar-nav" className="justify-content-end">
          <Nav className="gap-3">
            <NavLink href="/admin" className="fs-5 nav-link link-light">
              Home
            </NavLink>
            <NavLink
              className="fs-5 nav-link link-light"
              onClick={handleLogout}
              style={{
                cursor: "pointer",
              }}
            >
              Logout
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
};

export default AdminNav;
