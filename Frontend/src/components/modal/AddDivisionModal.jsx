import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import Swal from "sweetalert2";

const AddDivisionModal = ({ show, handleClose, handleSave }) => {
  const [divisionData, setDivisionData] = useState({
    division_name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDivisionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleSubmit = async () => {
    if (!divisionData.division_name.trim()) {
      setError("Division name is required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/divisions/add-division`,
        divisionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.fire({
        icon: "success",
        title: response.data.message || "Division updated successfully",
      });

      handleSave();
      setDivisionData({ division_name: "", description: "" });
      setTimeout(handleClose, 2000);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
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
        <Modal.Title className="fw-bold">Add New Division</Modal.Title>
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
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Division Name</Form.Label>
            <Form.Control
              type="text"
              name="division_name"
              value={divisionData.division_name}
              onChange={handleChange}
              placeholder="Enter division name"
              className="rounded-3 shadow-sm"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={divisionData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter description"
              className="rounded-3 shadow-sm"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="secondary"
          className="rounded-pill px-4"
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          variant="primary"
          className="rounded-pill px-4"
          onClick={handleSubmit}
        >
          Save Division
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDivisionModal;
