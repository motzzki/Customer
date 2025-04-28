import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";
import { handlePrintDateRange } from "../../utils/printUtils";
import { handlePrintMonth } from "../../utils/printMonth";
import Swal from "sweetalert2";

const PrintModal = ({ show, handleClose, division_id, division_name }) => {
  const [divisionId, setDivision] = useState(division_id);
  const [divisionName, setDivisionName] = useState(division_name);
  const [info, setInfo] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [services, setServices] = useState({});
  const [selectedSubdivision, setSelectedSubdivision] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [dateRange, setDateRange] = useState(true);
  const [month, setMonth] = useState(true);
  const [questions, setQuestions] = useState([]);

  const [customerStats, setCustomerStats] = useState([]);
  const [customerStatsMonth, setCustomerStatsMonth] = useState([]);
  const [surveyResults, setSurveyResults] = useState([]);
  const [surveyResultsMonth, setSurveyResultsMonth] = useState([]);
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To capture errors
  const [customerType, setCustomerType] = useState("");

  const subdivisionMap = {
    "Learning Resource Management Section": "LRMS",
    "Instructional Management Section": "IMS",
    "Public School District Supervisor": "PSDS",
    "Human Resource Development": "HRD",
    "School Management Monitoring and Evaluation Section": "SMME",
    "Social Mobilization and Networking": "SocMob",
  };

  const resolvedDivision =
    subdivisionMap[selectedSubdivision?.sub_division_name] ??
    selectedSubdivision?.sub_division_name ??
    divisionName;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_BASE_URL}/divisions/services-and-subdivisions/${division_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInfo(response.data);
        // console.log("Service and Sub D:", response.data);
        // Extract unique subdivisions
        const uniqueSubdivisions = [
          ...new Map(
            response.data
              .filter((item) => item.sub_division_name) // Exclude null subdivisions
              .map((item) => [item.sub_division_id, item.sub_division_name])
          ).values(),
        ];

        // Group services by subdivision or assign to division if no subdivision
        const groupedServices = response.data.reduce((acc, item) => {
          const key = item.sub_division_name || "Division Services";

          if (!acc[key]) {
            acc[key] = [];
          }

          if (item.service_name) {
            acc[key].push(item.service_name);
          }

          return acc;
        }, {});

        // Update state with subdivisions and services data
        setSubdivisions(uniqueSubdivisions);
        setServices(groupedServices);
        setSelectedSubdivision(null); // Set default to null or first subdivision
        setSelectedService(null); // Set default to null or first service
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (optional: show alert)
      }
    };

    fetchData();
  }, [division_id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/questions/get-questions`
        );
        // console.log("Questions API response:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          console.error("Unexpected questions data format:", response.data);
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      }
    };

    fetchQuestions();
  }, []);

  const fetchCustomerStats = async (
    fk_division,
    fk_service,
    fk_subdivision,
    customer_type,
    startDate,
    endDate
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        fk_division,
        fk_service,
        ...(fk_subdivision && { fk_subdivision }), // Only include if exists
        customer_type,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });

      const response = await axios.get(
        `${API_BASE_URL}/divisions/customer-stats?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerStats(response.data);
      console.log("Customer stats API response:", response.data);
      return response.data; // Return the data directly
    } catch (err) {
      console.error("Error fetching customer stats:", err);
      setError("Failed to fetch data. Please try again later.");
      throw err; // Re-throw the error to be caught in handlePrint
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerStatsMonth = async (
    fk_division,
    fk_subdivision,
    month,
    year
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        fk_division,
        fk_subdivision, // Only include if exists
        month,
        year,
      });

      const response = await axios.get(
        `${API_BASE_URL}/divisions/customer-stats-month?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomerStatsMonth(response.data);
      console.log("Customer stats API response Month:", response.data);
      return response.data; // Return the data directly
    } catch (err) {
      console.error("Error fetching customer stats Month:", err);
      setError("Failed to fetch data. Please try again later.");
      throw err; // Re-throw the error to be caught in handlePrint
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyResults = async (
    fk_division,
    fk_service,
    fk_subdivision,
    customer_type,
    startDate,
    endDate
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        fk_division,
        fk_service,
        ...(fk_subdivision && { fk_subdivision }), // Only include if exists
        customer_type: customer_type === "" ? null : customer_type,
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });

      const response = await axios.get(
        `${API_BASE_URL}/divisions/survey-results?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSurveyResults(response.data);
      console.log("Survey results API response:", response.data);
      console.log("Selected Customer Type:", customer_type);
      return response.data; // Return the data directly
    } catch (err) {
      console.error("Error fetching survey results:", err);
      setError("Failed to fetch data. Please try again later.");
      throw err; // Re-throw the error to be caught in handlePrint
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyResultsMonth = async (
    fk_division,
    fk_subdivision,
    month,
    year
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        fk_division,
        ...(fk_subdivision && { fk_subdivision }), // Only include if exists
        month,
        year,
      });

      const response = await axios.get(
        `${API_BASE_URL}/divisions/survey-results-month?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSurveyResultsMonth(response.data);
      console.log("Survey results API response Month:", response.data);
      return response.data; // Return the data directly
    } catch (err) {
      console.error("Error fetching survey results month:", err);
      setError("Failed to fetch data. Please try again later.");
      throw err; // Re-throw the error to be caught in handlePrint
    } finally {
      setLoading(false);
    }
  };

  const handleDateRange = () => {
    // Handle date range logic here
    console.log("Date range selected");
    setDateRange(false);
    setMonth(true);
  };

  const handleMonth = () => {
    // Handle date range logic here
    console.log("Month selected");
    setDateRange(true);
    setMonth(false);
  };

  const handlePrint = async () => {
    try {
      if (!dateRange) {
        if (!selectedService?.service_id || customerType === "" || selectedDate === undefined || selectedEndDate === undefined) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields.",
          });
          return;
        }
        // First fetch the customer stats
        const stats = await fetchCustomerStats(
          divisionId,
          selectedService?.service_id,
          selectedSubdivision?.sub_division_id,
          customerType === "" ? null : customerType,
          moment(selectedDate).format("YYYY-MM-DD"),
          moment(selectedEndDate).format("YYYY-MM-DD")
        );

        const results = await fetchSurveyResults(
          divisionId,
          selectedService?.service_id,
          selectedSubdivision?.sub_division_id,
          customerType === "" ? null : customerType,
          moment(selectedDate).format("YYYY-MM-DD"),
          moment(selectedEndDate).format("YYYY-MM-DD")
        );
        console.log("service id", selectedService?.service_id);
        console.log("subdivision id", selectedSubdivision?.sub_division_id);
        console.log(selectedDate)
        console.log(selectedEndDate)
        

        // Then proceed with printing using the fetched data
        handlePrintDateRange(
          questions,
          resolvedDivision,
          selectedDate,
          moment(selectedEndDate).format("MMMM YYYY"),
          stats, // Use the directly returned data rather than state
          results,
          customerType === "" ? null : customerType,
          selectedService?.service_name
        );
      } else {
        console.log("asdasdasd:", selectedSubdivision?.sub_division_id ?? divisionId);
        if (selectedDate === undefined) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields.",
          });
          return;
        }
        const statsMonth = await fetchCustomerStatsMonth(
          divisionId,
          selectedSubdivision?.sub_division_id ?? null,
          moment(selectedDate).format("M"),
          moment(selectedDate).format("YYYY")
        );

        const results = await fetchSurveyResultsMonth(
          divisionId,
          selectedSubdivision?.sub_division_id ?? null,
          moment(selectedDate).format("M"),
          moment(selectedDate).format("YYYY")
        );
        handlePrintMonth(
          questions,
          resolvedDivision,
          moment(selectedDate).format("MMMM YYYY"),
          statsMonth,
          results
        );
      }
    } catch (err) {
      console.error("Error during handlePrint:", err);
    }
  };

  const handleChange = (e) => {
    setCustomerType(e.target.value);
    console.log("Selected Customer Type:", e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">Generate Report</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="mb-4">
          <h5 className="mb-3">Report Type</h5>
          <div className="d-flex gap-3 mb-4">
            <Button
              variant={dateRange ? "outline-primary" : "primary"}
              onClick={handleDateRange}
              className="flex-grow-1"
            >
              Date Range
            </Button>
            <Button
              variant={month ? "outline-primary" : "primary"}
              onClick={handleMonth}
              className="flex-grow-1"
            >
              Monthly
            </Button>
          </div>
        </div>

        <Form>
          <div className="row g-3 mb-4">
            {month && (
              <div className="col-md-6">
                <Form.Label>Customer Type</Form.Label>
                <Form.Select value={customerType} onChange={handleChange}>
                  <option value="">All Customer Types</option>
                  <option value="Business">Business</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Government">Government</option>
                </Form.Select>
              </div>
            )}

            {subdivisions.length > 0 && (
              <div className="col-md-6">
                <Form.Label>Office</Form.Label>
                <Form.Select
                  value={selectedSubdivision?.sub_division_name || ""}
                  onChange={(e) => {
                    const selectedSub = info.find(
                      (item) => item.sub_division_name === e.target.value
                    );
                    setSelectedSubdivision(selectedSub || null);
                    setSelectedService(null);
                  }}
                >
                  <option value="">All Offices</option>
                  {subdivisions.map((subdivision, index) => (
                    <option key={index} value={subdivision}>
                      {subdivision}
                    </option>
                  ))}
                </Form.Select>
              </div>
            )}

            {month && (
              <div className="col-md-6">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  value={selectedService?.service_name || ""}
                  onChange={(e) => {
                    const selectedServ = info.find(
                      (item) =>
                        item.service_name === e.target.value &&
                        (selectedSubdivision
                          ? item.sub_division_id ===
                            selectedSubdivision.sub_division_id
                          : item.sub_division_id === null)
                    );
                    setSelectedService(selectedServ || null);
                  }}
                >
                  <option value="">All Services</option>
                  {info
                    .filter((item) =>
                      selectedSubdivision
                        ? item.sub_division_id ===
                          selectedSubdivision.sub_division_id
                        : item.sub_division_id === null
                    )
                    .map((item) => (
                      <option key={item.service_id} value={item.service_name}>
                        {item.service_name}
                      </option>
                    ))}
                </Form.Select>
              </div>
            )}
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Form.Label>{month ? "Start Date" : "Month"}</Form.Label>
              <DatePicker
                className="form-control"
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>

            {month && (
              <div className="col-md-6">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  className="form-control"
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  selected={selectedEndDate}
                  onChange={(date) => setSelectedEndDate(date)}
                />
              </div>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-top">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePrint} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintModal;