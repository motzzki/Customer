import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Header from "../components/header2";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import '../style/PageStyle.css'

function citizenCharter2() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    if (userData.charter2) {
      setSelectedOption(userData.charter2);
    }
  }, []);

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    userData.charter2 = value;

    sessionStorage.setItem("userData", JSON.stringify(userData));
  };
  const nextPage = () => {
    if (!selectedOption) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select before proceeding!",
      });
      return;
    }
    let userData = JSON.parse(sessionStorage.getItem('userData'))
    if (userData.charter2 == "yes" || userData.charter2 == "yesbut") {
      navigate("/citizen-charter3");
    } else {
      delete userData.charter3;
      sessionStorage.setItem('userData', JSON.stringify(userData));
      navigate("/client-satisfaction");
    }
  };

  const backPage = () => {
    navigate("/citizen-charter");
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
              className="mb-3 rounded p-3"
              style={{ backgroundColor: "#dfe7f5" }}
            >
              <p className="info">
                Did you see the SDO Citizen's Charter (online or posted in the
                office)?
              </p>
              <div className="info">
                <Form.Check
                  type="radio"
                  label="Yes - it was easy to find"
                  name="yesno"
                  id="yes"
                  value="yes"
                  checked={selectedOption == "yes"}
                  onChange={handleSelect}
                />
                <Form.Check
                  type="radio"
                  label="Yes - but it was hard to find"
                  name="yesno"
                  id="yesbut"
                  value="yesbut"
                  checked={selectedOption == "yesbut"}
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

export default citizenCharter2;
