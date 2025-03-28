import React, { useState, useEffect } from "react";
import { Button, Card, CardBody } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { Link } from "react-router-dom";
import { FaPlus, FaRegEdit, FaTrash, FaSearch } from "react-icons/fa";
import AddDivisionModal from "./modal/AddDivisionModal.jsx";
import EditDivisionModal from "./modal/EditDivisionModal.jsx";

const CardDivision = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowEdit = (division) => {
    setSelectedDivision(division);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedDivision(null);
  };

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/divisions/get-divisions`
      );
      setDivisions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchDivisions();
  };

  const handleAlert = (message) => {
    alert(message);
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const filteredDivisions = divisions.filter((division) =>
    division.division_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="container">
      <div className="row mb-4">
        {/* Search Field */}
        <div className="col-12 d-flex justify-content-end justify-content-xs-center">
          <div
            className="input-group"
            style={{ width: "100%", maxWidth: "350px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search Divisions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: "38px" }} // Ensures uniform height
            />
            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              type="button"
              style={{
                height: "38px",
                padding: "0 12px",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {filteredDivisions.map(
              (division, index) =>
                division && (
                  <div
                    key={division.division_id || index}
                    className="col-md-4 col-sm-6 mb-3 d-flex"
                  >
                    <Card
                      className="custom-card d-flex flex-column justify-content-center text-center shadow-lg"
                      style={{ height: "200px", width: "100%" }}
                    >
                      <Link
                        to={`/divisions/${division.division_id}`}
                        style={{ textDecoration: "none" }}
                        state={{ division_name: division.division_name }}
                      >
                        <CardBody className="fw-bold fs-3 text-white text-uppercase d-flex justify-content-center align-items-center h-100">
                          {division.division_name}
                        </CardBody>
                      </Link>
                      <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleShowEdit(division);
                          }}
                          className="btn btn-warning btn-sm opacity-75 hover-opacity-100"
                        >
                          <FaRegEdit />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAlert("Delete clicked!");
                          }}
                          className="btn btn-danger btn-sm opacity-75 hover-opacity-100"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Card>
                  </div>
                )
            )}

            {/* Add New Division Card */}
            <div className="col-md-4 col-sm-6 mb-3 d-flex">
              <Card
                className="custom-card d-flex flex-column justify-content-center align-items-center text-center shadow bg-light"
                style={{
                  cursor: "pointer",
                  height: "200px",
                  width: "100%",
                }}
                onClick={handleShow}
              >
                <CardBody className="fs-6 d-flex align-items-center justify-content-center">
                  <FaPlus size={50} className="text-white" />
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Add Division Modal */}
      <AddDivisionModal
        show={showModal}
        handleClose={handleClose}
        handleSave={handleSave}
      />
      <EditDivisionModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        handleUpdate={fetchDivisions}
        division={selectedDivision}
      />
    </div>
  );
};

export default CardDivision;
