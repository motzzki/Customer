import { Button, Form } from "react-bootstrap";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../style/PageStyle.css";

function clientInformation() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [customerType, setCustomerType] = useState("");

  const nextPage = () => {
    if (!age || !sex || !customerType || age <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields before proceeding!",
      });
      return;
    }

    let userData = JSON.parse(sessionStorage.getItem("userData")) || {};

    userData.age = Number(age);
    userData.sex = sex;
    userData.customerType = Number(customerType);

    sessionStorage.setItem("userData", JSON.stringify(userData));

    navigate("/office-transact");
  };

  useEffect(() => {
    const info = JSON.parse(sessionStorage.getItem("userData"));
    if (info) {
      setAge(info.age);
    }
    if (info) {
      setSex(info.sex);
    }
    if (info) {
      setCustomerType(info.customerType);
    }
  }, []);

  const handleAgeChange = (event) => {
    const value = event.target.value;
    setAge(value);
    // sessionStorage.setItem("age", value);
  };

  const handleSexChange = (event) => {
    const value = event.target.value;
    setSex(value);
    // sessionStorage.setItem("sex", value);
  };

  const handleCustomerTypeChange = (event) => {
    const value = Number(event.target.value);
    setCustomerType(value);
    // sessionStorage.setItem("customerType", value);
  };

  return (
    <div className="pt-lg-5 pb-lg-5" style={{ backgroundColor: "#edf3fc" }}>
      <div
        className="w-75 m-auto border rounded shadow-lg content"
        style={{ backgroundColor: "#f5f9ff", width: "80%" }}
      >
        <Header />
        <div className="container">
          <div className="m-auto">
            <div className="rounded" style={{ backgroundColor: "#dfe7f5" }}>
              <p className="title">Client Information</p>
            </div>
            <div
              className="mb-3 rounded p-3"
              style={{ backgroundColor: "#dfe7f5" }}
              // controlId="age"
            >
              <p className="info">Age</p>
              <Form.Control
                className="info"
                type="number"
                min={0}
                placeholder="The value must be a number"
                value={age}
                onChange={handleAgeChange}
              />
            </div>

            <div
              className="mb-3 rounded p-3"
              style={{ backgroundColor: "#dfe7f5" }}
              // controlId="sex"
            >
              <p className="info">Sex</p>
              <div>
                <Form.Check
                  className="info"
                  type="radio"
                  label="Male"
                  name="sex"
                  id="male"
                  value="male"
                  checked={sex == "male"}
                  onChange={handleSexChange}
                />
                <Form.Check
                  className="info"
                  type="radio"
                  label="Female"
                  name="sex"
                  id="female"
                  value="female"
                  checked={sex == "female"}
                  onChange={handleSexChange}
                />
              </div>
            </div>

            <div
              className="mb-3 rounded p-3"
              style={{ backgroundColor: "#dfe7f5" }}
              // controlId="customerType"
            >
              <p className="info">Customer Type</p>
              <div>
                <Form.Check
                  className="info"
                  type="radio"
                  label="Business (private school, corporations, etc.)"
                  name="customerType"
                  id="business"
                  value="1"
                  checked={customerType === 1}
                  onChange={handleCustomerTypeChange}
                />
                <Form.Check
                  className="info"
                  type="radio"
                  label="Citizen (general public, learners, parents, former DepEd employees, researchers, NGOs etc.)"
                  name="customerType"
                  id="citizen"
                  value="2"
                  checked={customerType === 2}
                  onChange={handleCustomerTypeChange}
                />
                <Form.Check
                  className="info"
                  type="radio"
                  label="Government (current DepEd employees or employees of other government agencies & LGUs)"
                  name="customerType"
                  id="government"
                  value="3"
                  checked={customerType === 3}
                  onChange={handleCustomerTypeChange}
                />
              </div>
            </div>
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
  );
}

export default clientInformation;
