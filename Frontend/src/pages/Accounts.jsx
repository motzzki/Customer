import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import NewUser from "../components/modal/NewUser";
import EditUserModal from "../components/modal/EditUserModal";

const Accounts = () => {
  const [subUsers, setSubUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const handleShowNewUser = () => setShowNewUserModal(true);

  const handleCloseNewUser = () => setShowNewUserModal(false);

  const handleShowEditUser = () => setShowEditUserModal(true);

  const handleCloseEditModal = () => {
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubUsers();
  }, [searchTerm, currentPage]);

  const fetchSubUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/get-user`, {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubUsers(response.data.subUsers || response.data);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage) || 1);
    } catch (error) {
      console.error("Error fetching sub users:", error);
    }
  };

  const handleArchive = async (userId, status) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        status === 1
          ? "Do you want to archive this sub user?"
          : "Do you want to unarchive this sub user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText:
        status === 1 ? "Yes, archive it!" : "Yes, unarchive it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(`${API_BASE_URL}/users/archive/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire(
        status === 1 ? "Archived!" : "Unarchived!",
        `Sub user has been ${status === 1 ? "archived" : "unarchived"}.`,
        "success"
      );
      fetchSubUsers();
    } catch (error) {
      console.error("Error updating sub user status:", error);
      Swal.fire("Error!", "Could not update sub user status.", "error");
    }
  };

  const handleResetPassword = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reset the password for this sub user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(`${API_BASE_URL}/users/reset-password/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire(
        "Password Reset!",
        "Password has been reset to default.",
        "success"
      );
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire("Error!", "Could not reset password.", "error");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <AdminNav />
      <div className="container mt-4">
        <div>
          <Row className="align-items-center mb-3">
            <Col>
              <h2 className="mb-0">Sub Users</h2>
            </Col>
            <Col xs="auto">
              <Button onClick={handleShowNewUser}>Add User</Button>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search sub users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Date Created</th>
              <th>Date Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subUsers.length > 0 ? (
              subUsers.map((user) => (
                <tr key={user.sub_userId}>
                  <td>{user.sub_userId}</td>
                  <td>{user.sub_username}</td>
                  <td>{user.sub_firstname}</td>
                  <td>{user.sub_lastname}</td>
                  <td>{new Date(user.date_created).toLocaleString()}</td>
                  <td>{new Date(user.date_updated).toLocaleString()}</td>
                  <td>
                    <Button
                      variant={user.status === 1 ? "danger" : "success"}
                      size="sm"
                      className="me-2"
                      onClick={() =>
                        handleArchive(user.sub_userId, user.status)
                      }
                    >
                      {user.status === 1 ? "Archive" : "Unarchive"}
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleResetPassword(user)}
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit User
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No sub users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <NewUser
        show={showNewUserModal}
        handleClose={handleCloseNewUser}
        onSave={fetchSubUsers}
      />
      <EditUserModal
        show={showEditUserModal}
        handleClose={handleCloseEditModal}
        onSave={fetchSubUsers}
        user={selectedUser}
      />
    </>
  );
};

export default Accounts;
