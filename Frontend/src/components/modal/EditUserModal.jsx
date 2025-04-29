import React, { useState, useEffect } from "react";
import { Modal, Button, FloatingLabel, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const EditUserModal = ({ show, handleClose, onSave, user }) => {
  const [userData, setUserData] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.sub_username || "",
        firstname: user.sub_firstname || "",
        lastname: user.sub_lastname || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    const { username, firstname, lastname } = userData;

    if (!username || !firstname || !lastname) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/users/edit-user/${user.sub_userId}`,
        { username, firstname, lastname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("User updated successfully.");
      onSave(); //
      setTimeout(() => {
        handleClose();
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fw-bold">Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && (
          <Alert variant="danger" className="shadow-sm">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="shadow-sm">
            {successMessage}
          </Alert>
        )}

        <Form>
          <FloatingLabel label="Username" className="mb-3">
            <Form.Control
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </FloatingLabel>

          <FloatingLabel label="First Name" className="mb-3">
            <Form.Control
              type="text"
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </FloatingLabel>

          <FloatingLabel label="Last Name" className="mb-3">
            <Form.Control
              type="text"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </FloatingLabel>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="outline-primary"
          className="rounded-pill px-4"
          onClick={handleSubmit}
        >
          Update User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
