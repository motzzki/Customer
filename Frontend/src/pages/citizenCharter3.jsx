import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Header from "../components/header2";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../style/PageStyle.css'

function citizenCharter3() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    let userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    if (userData.charter3) {
      setSelectedOption(userData.charter3);
    }
  }, []);

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    let userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    userData.charter3 = value;

    sessionStorage.setItem("userData", JSON.stringify(userData));
  };
  //

  const nextPage = () => {
    if (!selectedOption) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select before proceeding!",
      });
      return;
    }
    navigate("/client-satisfaction");
  };

  const backPage = () => {
    navigate("/citizen-charter2");
  };

  return (
    <div
      className="pt-lg-5 pb-lg-5"
      style={{ backgroundColor: "#edf3fc", height: "100vh" }}
    >
      <div
        className="w-75 m-auto border rounded shadow-lg content"
        style={{ backgroundColor: "#f5f9ff" }}
      >
        <Header />
        <div className="container">
          <div className="m-auto">
            <div className="rounded" style={{ backgroundColor: "#dfe7f5" }}>
              <p className="title">Citizen's Charter</p>
            </div>

            <div
              className="mb-3 rounded p-3 info"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <p>
                Did you use the SDO Citizen's Charter as a guide for the service
                you availed
              </p>
              <div>
                <Form.Check
                  type="radio"
                  label="Yes"
                  name="yesno"
                  id="yes"
                  value="yes"
                  checked={selectedOption == "yes"}
                  onChange={handleSelect}
                />
                <Form.Check
                  type="radio"
                  label="No"
                  name="yesno"
                  id="no"
                  value="no"
                  checked={selectedOption == "no"}
                  onChange={handleSelect}
                />
              </div>
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

              <Button className="info" style={{ backgroundColor: "green" }} onClick={nextPage}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default citizenCharter3;
