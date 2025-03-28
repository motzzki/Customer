import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config.js";

const EditDivisionModal = ({ show, handleClose, handleUpdate, division }) => {
  const [divisionData, setDivisionData] = useState({
    division_id: null,
    division_name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (division) {
      setDivisionData({
        division_id: division.division_id || null,
        division_name: division.division_name || "",
        description: division.description || "",
      });
    }
  }, [division]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDivisionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!divisionData.division_name.trim()) {
      setError("Division name is required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/divisions/updateDivision`,
        divisionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      handleUpdate();
      setTimeout(handleClose, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title className="fw-bold">Edit Division</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form>
          <Form.Control
            type="hidden"
            name="division_id"
            value={divisionData.division_id || ""}
          />

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
          variant="warning"
          className="rounded-pill px-4"
          onClick={handleSubmit}
        >
          Update Division
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDivisionModal;
