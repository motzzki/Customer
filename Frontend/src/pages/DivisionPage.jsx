import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card, Pagination } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import { API_BASE_URL } from "../config";
import axios from "axios";
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import PrintModal from "../components/modal/printModal";

const DivisionPage = () => {
  const [data, setData] = useState([]);
  const [filterCustomer, setFilterCustomer] = useState("");
  const { division_id } = useParams();
  const location = useLocation();
  const { division_name } = location.state || {};

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [info, setInfo] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSubdivision, setSelectedSubdivision] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const [showNewPrintModal, setShowNewPrintModal] = useState(false);

  const handleShowPrintModal = () => setShowNewPrintModal(true);
  const handleClosePrintModal = () => setShowNewPrintModal(false);

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

  useEffect(() => {
    if (division_id) {
      fetchFeedbackByDivision(
        division_id,
        filterCustomer,
        selectedService,
        selectedSubdivision,
        startDate,
        endDate
      );
    }
  }, [
    division_id,
    filterCustomer,
    selectedService,
    selectedSubdivision,
    startDate,
    endDate,
  ]);

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

        setSubdivisions(uniqueSubdivisions);
        setServices(groupedServices);
        setSelectedSubdivision(null);
        setSelectedService(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [division_id]);

  const selectedServiceId = selectedService?.service_id || null;
  const selectedSubdivisionId = selectedSubdivision?.sub_division_id || null;

  const fetchFeedbackByDivision = async (
    division_id,
    filterCustomer,
    selectedService,
    selectedSubdivision,
    startDate,
    endDate
  ) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (filterCustomer) {
        params.append("customer_type", filterCustomer);
      }

      console.log("Customer: ", filterCustomer?.customer_type);

      if (selectedService?.service_name) {
        params.append("service", selectedService.service_name);
      }

      if (selectedSubdivision?.sub_division_name) {
        params.append("subdivision_id", selectedSubdivision?.sub_division_name);
      }

      if (startDate) {
        params.append("start_date", startDate.toISOString().split("T")[0]);
      }

      if (endDate) {
        params.append("end_date", endDate.toISOString().split("T")[0]);
      }

      console.log("API request params:", params.toString());

      const response = await axios.get(
        `${API_BASE_URL}/divisions/get-feedback/${division_id}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API response data:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // 4. Final filtered data

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleClearFilters = () => {
    setFilterCustomer("");
    setSelectedSubdivision("");
    setSelectedService("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const hasSubDivision = data.some((item) => item?.sub_division_name);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // console.log("Selected Service ID:", selectedServiceId);
    // console.log("Selected Subdivision ID:", selectedSubdivisionId);

    // console.log(
    //   "Selected Subdivision ID:",
    //   selectedSubdivision?.sub_division_id
    // );
    // console.log("Selected Service ID:", selectedService?.service_id);

    // console.log("Filtered Data:", filteredData);
    // console.log("Customer:", filterCustomer);

    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {startPage > 1 && (
          <>
            <Pagination.Item onClick={() => handlePageChange(1)}>
              1
            </Pagination.Item>
            {startPage > 2 && <Pagination.Ellipsis disabled />}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Pagination.Ellipsis disabled />}
            <Pagination.Item onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </Pagination.Item>
          </>
        )}
        <Pagination.Next
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div className="admin-bg">
      <AdminNav />
      <h2 className="text-center p-3 text-uppercase">{division_name}</h2>

      <div className="d-flex justify-content-between align-items-center px-4 mb-4">
        <div className="d-flex gap-3">
          <Form.Select
            className="w-auto"
            onChange={(e) => setFilterCustomer(e.target.value)}
            value={filterCustomer}
          >
            <option value="">Customer Type</option>
            <option value="Business">Business</option>
            <option value="Citizen">Citizen</option>
            <option value="Government">Government</option>
          </Form.Select>

          {subdivisions.length > 0 && (
            <Form.Select
              className="w-auto"
              value={selectedSubdivision?.sub_division_name || ""}
              onChange={(e) => {
                const selectedSub = info.find(
                  (item) => item.sub_division_name === e.target.value
                );
                setSelectedSubdivision(selectedSub || null);
              }}
            >
              <option value="">Office Transacted</option>
              {subdivisions.map((subdivision, index) => (
                <option key={index} value={subdivision}>
                  {subdivision}
                </option>
              ))}
            </Form.Select>
          )}

          <Form.Select
            className="w-auto"
            value={selectedService?.service_name || ""}
            onChange={(e) => {
              const selectedServ = info.find(
                ({ service_name }) => service_name === e.target.value
              );
              setSelectedService(selectedServ || null);
            }}
          >
            <option value="">Service Availed</option>
            {info
              .filter(({ sub_division_name, sub_division_id }) =>
                selectedSubdivision
                  ? sub_division_name === selectedSubdivision.sub_division_name
                  : sub_division_id === null
              )
              .map(({ service_id, service_name }) => (
                <option key={service_id} value={service_name}>
                  {service_name}
                </option>
              ))}
          </Form.Select>

          <div className="d-flex align-items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="form-control"
              dateFormat="yyyy-MM-dd"
              // showMonthYearPicker
              // showFullMonthYearPicker
            />
            <span className="text-muted">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="form-control"
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
              // showMonthYearPicker
              // showFullMonthYearPicker
            />
          </div>

          <Button variant="outline-secondary" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>

        <Button variant="success" onClick={handleShowPrintModal}>
          Print
        </Button>
      </div>

      <Card className="mx-4 bg-white shadow-sm rounded-3 overflow-hidden border">
        <div className="card-header" style={{ backgroundColor: "#294a70" }}>
          <h5 className="mb-0 text-white">Customer Data</h5>
        </div>
        <Table bordered hover responsive="md" className="mb-0">
          <thead className="bg-light">
            <tr>
              {[
                "Age",
                "Gender",
                "Customer Type",
                ...(hasSubDivision ? ["Office Transacted"] : []),
                "Service Availed",
                "Charter(1)",
                "Charter(2)",
                "Charter(3)",
                "SQD1",
                "SQD2",
                "SQD3",
                "SQD4",
                "SQD5",
                "SQD6",
                "SQD7",
                "SQD8",
                "Remarks",
                "Created At",
              ].map((header) => (
                <th key={header} className="text-center text-uppercase p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="align-middle">
                  <td className="text-center">{item.age}</td>
                  <td className="text-center">{item.gender.toUpperCase()}</td>
                  <td className="text-center">{item.customer_type}</td>
                  {hasSubDivision && (
                    <td className="text-center">{item.sub_division_name}</td>
                  )}
                  <td className="text-center">{item.service}</td>
                  <td className="text-center">
                    {item.charter_one ? item.charter_one.toUpperCase() : "-"}
                  </td>
                  <td className="text-center">
                    {item.charter_two ? item.charter_two.toUpperCase() : "-"}
                  </td>
                  <td className="text-center">
                    {item.charter_three
                      ? item.charter_three.toUpperCase()
                      : "-"}
                  </td>
                  <td className="text-center">{item.SQD1}</td>
                  <td className="text-center">{item.SQD2}</td>
                  <td className="text-center">{item.SQD3}</td>
                  <td className="text-center">{item.SQD4}</td>
                  <td className="text-center">{item.SQD5}</td>
                  <td className="text-center">{item.SQD6}</td>
                  <td className="text-center">{item.SQD7}</td>
                  <td className="text-center">{item.SQD8}</td>
                  <td className="text-center text-success fw-semibold">
                    {item.remarks ? item.remarks : "-"}
                  </td>
                  <td className="text-center text-muted">
                    {moment(item.created_at).format("MMMM Do YYYY")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={hasSubDivision ? 19 : 18}
                  className="text-center text-danger py-4"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-3">
          {renderPagination()}
        </div>
      </Card>
      <PrintModal
        show={showNewPrintModal}
        handleClose={handleClosePrintModal}
        division_id={division_id}
        division_name={division_name}
      />
    </div>
  );
};

export default DivisionPage;
