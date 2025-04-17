import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Header from "../components/header2";
import { useNavigate } from "react-router-dom";
import Happy from "../assets/Images/happy.jpg";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import axios from "axios";

const ClientSatisfaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    return JSON.parse(sessionStorage.getItem("userData")) || {};
  });
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/divisions/get-questions`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const savedData = JSON.parse(sessionStorage.getItem("userData")) || {};
    setFormData(savedData);
  }, []);

  const handleSelect = (questionLabel, value) => {
    const numValue = Number(value);

    setFormData((prev) => ({ ...prev, [questionLabel]: numValue }));

    let userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    userData[questionLabel] = numValue;
    sessionStorage.setItem("userData", JSON.stringify(userData));
  };

  const handleRemarks = (event) => {
    const value = event.target.value;
    setRemarks(value);
  };

  const backPage = () => {
    navigate("/office-transact");
  };

  const handleSubmit = async () => {
    const unansweredQuestion = questions.find(
      (q) => formData[q.label] === undefined
    );

    if (unansweredQuestion) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all questions before proceeding!",
      });

      const element = document.getElementById(unansweredQuestion.label);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      // Build array of answers
      const answers = questions.map((q) => ({
        questionId: q.questions_id,
        value: formData[q.label],
      }));

      const payload = {
        age: formData.age,
        gender: formData.sex,
        type: formData.customerType,
        divisionId: formData.officeId,
        subDivisionId: formData.sub_division_id || null,
        serviceId: formData.service_id,
        service: formData.service,
        chart1: formData.charter1 || null,
        chart2: formData.charter2 || null,
        chart3: formData.charter3 || null,
        remarks: remarks || null,
        created_at: new Date().toISOString().split("T")[0],
        answers, // 👈 attach all answers here
      };

      const response = await axios.post(
        `${API_BASE_URL}/divisions/insert-feedback`,
        payload
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Feedback submitted successfully!",
        });
        sessionStorage.removeItem("userData");
        navigate("/thank-you");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit feedback. Please try again.",
      });
    }
  };

  return (
    <div
      className="pt-lg-5 pb-lg-5"
      style={{ backgroundColor: "#edf3fc", height: "100%" }}
    >
      <div
        className="w-75 m-auto border rounded shadow-lg content"
        style={{ backgroundColor: "#f5f9ff" }}
      >
        <Header />
        <div className="container">
          <div className="m-auto">
            <div
              className="rounded mb-3"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <div className="p-3">
                <p className="title">Client Satisfaction</p>
                <div style={{ textAlign: "center" }}>
                  <img className="happy" src={Happy} alt="Happy face" />
                </div>
              </div>
            </div>

            <div
              className="mb-3 rounded"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <p className="info p-3">Service Quality Dimension (SQD)</p>
            </div>

            <div
              className="mb-3 rounded"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              {loading ? (
                <div className="text-center p-3">Loading...</div>
              ) : (
                <table className="table-striped">
                  <thead>
                    <tr className="d-none d-lg-table-row">
                      <th></th>
                      <th className="text-wrap rate">Strongly Agree (5)</th>
                      <th className="text-wrap rate">Agree (4)</th>
                      <th className="text-wrap rate">
                        Neither Agree nor Disagree (3)
                      </th>
                      <th className="text-wrap rate">Disagree (2)</th>
                      <th className="text-wrap rate">Strongly Disagree (1)</th>
                      <th className="text-wrap rate">Not applicable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <React.Fragment key={question.questions_id}>
                        <tr className="SQDBQ">
                          <td colSpan="12" className="question-box">
                            {question.label} - {question.questions_text}
                          </td>
                        </tr>
                        <tr className="SQDBQ">
                          <td colSpan="12">
                            <div className="button-container">
                              {[
                                { value: 5, label: "Strongly Agree (5)" },
                                { value: 4, label: "Agree (4)" },
                                {
                                  value: 3,
                                  label: "Neither Agree nor Disagree (3)",
                                },
                                { value: 2, label: "Disagree (2)" },
                                { value: 1, label: "Strongly Disagree (1)" },
                                { value: 0, label: "Not applicable" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  className={`custom-button ${
                                    formData[question.label] === option.value
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSelect(question.label, option.value)
                                  }
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr className="SQDC">
                          <td className="SQDQ">
                            {question.label} - {question.questions_text}
                          </td>
                          {[5, 4, 3, 2, 1, 0].map((value) => (
                            <td key={value}>
                              <Form.Check
                                inline
                                label=""
                                name={question.label}
                                type="radio"
                                id={`${question.label}-${value}`}
                                className="custom-radio"
                                value={value}
                                onChange={(e) =>
                                  handleSelect(
                                    question.label,
                                    Number(e.target.value)
                                  )
                                }
                                checked={formData[question.label] === value}
                              />
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div
              className="rounded mt-5"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <p className="fw-bold p-3">Remarks</p>
            </div>
            <div className="mb-5">
              <textarea
                className="form-control"
                style={{ height: "100px" }}
                placeholder="Enter your answer..."
                value={remarks}
                onChange={handleRemarks}
              />
            </div>

            <div className="d-flex" style={{ width: "150px" }}>
              <Button
                variant="light"
                onClick={backPage}
                style={{ marginRight: "13px", backgroundColor: "#ededed" }}
              >
                Back
              </Button>
              <Button
                style={{ backgroundColor: "green" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSatisfaction;
