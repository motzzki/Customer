import React, { useState, useContext } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavLink,
  NavbarToggle,
  NavbarCollapse,
  NavDropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import navLogo from "../assets/Images/logo.png";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import NewUser from "./modal/NewUser";
import { AuthContext } from "../auth/AuthContext.jsx";

const AdminNav = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Assuming you have a context for user data
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // // Listen for screen size changes
  // React.useEffect(() => {
  //   const handleResize = () => setIsMobile(window.innerWidth < 768);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const [showModal, setShowModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const handleShowNewUser = () => setShowNewUserModal(true);
  const handleCloseNewUser = () => setShowNewUserModal(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
    <>
      <Navbar
        expand="lg"
        className="py-3 mb-5"
        style={{ backgroundColor: "#294a70" }}
      >
        <Container>
          <NavbarBrand
            href="/admin"
            className="d-flex align-items-center gap-2"
          >
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
            <Nav className="gap-3 align-items-center">
              <NavLink href="/admin" className="fs-5 nav-link link-light">
                Home
              </NavLink>

              <NavDropdown
                title={
                  <span style={{ color: "#fff" }}>{user?.firstname} </span>
                }
                id="basic-nav-dropdown"
                className="fs-5"
              >
                <NavDropdown.Item onClick={handleShow}>
                  Change Password
                </NavDropdown.Item>
                {user?.role === "admin" && (
                  <NavDropdown.Item onClick={handleShowNewUser}>
                    Add New User
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>

      <ChangePasswordModal show={showModal} handleClose={handleClose} />
      {/* Add New User Modal */}
      <NewUser show={showNewUserModal} handleClose={handleCloseNewUser} />
    </>
  );
};

export default AdminNav;
