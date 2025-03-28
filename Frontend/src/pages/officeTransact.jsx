import Button from "react-bootstrap/Button";
import Header from "../components/header2";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../style/PageStyle.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

const officeTransact = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState({
    id: null,
    name: "Select your answer",
  });

  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    const selected = divisions.find(
      (division) => division.division_id.toString() === eventKey
    );
    if (selected) {
      setSelectedDivision({
        id: selected.division_id,
        name: selected.division_name,
      });
    }
  };

  useEffect(() => {
    const savedOffice = JSON.parse(sessionStorage.getItem("userData"));
    if (savedOffice?.office) {
      setSelectedDivision({
        id: savedOffice.divisionId,
        name: savedOffice.office,
      });
    }
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/divisions/get-divisions`
      );
      setDivisions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      setDivisions([]);
    }
  };

  const nextPage = () => {
    if (selectedDivision.name === "Select your answer") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a division before proceeding!",
      });
      return;
    }
    let office = JSON.parse(sessionStorage.getItem("userData"));
    if (office.office === selectedDivision.name) {
      navigate("/service-avail");
    } else {
      let userData = JSON.parse(sessionStorage.getItem("userData")) || {};
      userData.office = selectedDivision.name;
      userData.officeId = selectedDivision.id;

      // Clear unnecessary fields
      [
        "service",
        "charter1",
        "charter2",
        "charter3",
        "insideOffice",
        "SQD1",
        "SQD2",
        "SQD3",
        "SQD4",
        "SQD5",
        "SQD6",
        "SQD7",
        "SQD8",
      ].forEach((field) => delete userData[field]);

      sessionStorage.setItem("userData", JSON.stringify(userData));
      navigate("/service-avail");
    }
  };

  const backPage = () => {
    navigate("/");
  };

  return (
    <div
      className="pt-lg-5 pb-lg-5"
      style={{ backgroundColor: "#edf3fc", height: "100vh" }}
    >
      <div className="w-75 m-auto border rounded shadow-lg content">
        <Header />
        <div className="container">
          <div className="m-auto">
            <div className="rounded" style={{ backgroundColor: "#dfe7f5" }}>
              <p className="title">Schools Division Office</p>
            </div>

            <div
              className="mb-3 rounded p-3"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <p className="info">Office transacted with</p>
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle
                  variant="light"
                  className="text-truncate info"
                  style={{ width: "100%", textAlign: "left" }}
                  id="dropdown-basic"
                >
                  {selectedDivision.name}
                </Dropdown.Toggle>

                <Dropdown.Menu className="info">
                  {divisions.length > 0 ? (
                    divisions.map((division) => (
                      <Dropdown.Item
                        key={division.division_id}
                        eventKey={division.division_id.toString()}
                      >
                        {division.division_name}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>
                      No divisions available
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="d-flex" style={{ width: "150px" }}>
              <Button
                className="info"
                variant="light"
                onClick={backPage}
                style={{ backgroundColor: "#ededed", marginRight: "13px" }}
              >
                Back
              </Button>

              <Button
                className="info"
                style={{ backgroundColor: "green" }}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default officeTransact;
