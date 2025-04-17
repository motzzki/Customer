import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordModal = ({ show, handleClose }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setConfirmPass] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assuming you store your token here
      const res = await axios.post(
        `${API_BASE_URL}/users/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(res.data.message);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Optionally close the modal after a delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
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
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title className="fw-bold">Password Change</Modal.Title>
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
          {/* OLD PASSWORD */}
          <InputGroup className="mb-3">
            <FloatingLabel label="Old Password">
              <Form.Control
                type={showOldPass ? "text" : "password"}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handleChange}
                placeholder="Enter old password"
              />
            </FloatingLabel>
            <InputGroup.Text
              onClick={() => setShowOldPass(!showOldPass)}
              style={{ cursor: "pointer" }}
            >
              {showOldPass ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          </InputGroup>
          {/* NEW PASSWORD */}
          <InputGroup className="mb-3">
            <FloatingLabel label="New Password">
              <Form.Control
                type={showNewPass ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </FloatingLabel>
            <InputGroup.Text
              onClick={() => setShowNewPass(!showNewPass)}
              style={{ cursor: "pointer" }}
            >
              {showNewPass ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          </InputGroup>
          {/* CONFIRM PASSWORD */}
          <InputGroup>
            <FloatingLabel label="Confirm Password">
              <Form.Control
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </FloatingLabel>
            <InputGroup.Text
              onClick={() => setConfirmPass(!showConfirmPass)}
              style={{ cursor: "pointer" }}
            >
              {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="outline-danger"
          className="rounded-pill px-4"
          onClick={handleSubmit}
        >
          Change Password
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
