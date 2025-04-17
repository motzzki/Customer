import React, { useState } from "react";
import {
  Alert,
  Button,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const NewUser = ({ show, handleClose }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setConfirmPass] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    const { username, password, confirmPassword, firstname, lastname } =
      userData;

    if (!username || !password || !confirmPassword || !firstname || !lastname) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/users/new-user`,
        {
          username,
          password,
          firstname,
          lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("User created successfully.");
        setUserData({
          username: "",
          password: "",
          confirmPassword: "",
          firstname: "",
          lastname: "",
        });
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create user. Try again."
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
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="fw-bold">Add New User</Modal.Title>
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

          {/* NEW PASSWORD */}
          <InputGroup className="mb-3">
            <FloatingLabel label="Password">
              <Form.Control
                type={showNewPass ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter password"
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
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
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
          variant="outline-primary"
          className="rounded-pill px-4"
          onClick={handleSubmit}
        >
          Create User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewUser;
