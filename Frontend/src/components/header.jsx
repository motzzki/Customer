import React from "react";
import { Link } from "react-router-dom";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

import DepedLogo from "../assets/Images/depedlogo.png";
import { IoIosLogIn } from "react-icons/io";
import "../style/Header.css";

const header = () => {
  const renderTooltip = (props) => (
    <Tooltip id="login-tooltip" {...props}>
      Login
    </Tooltip>
  );

  return (
    <div
      className="container-fluid p-0 rounded-top position-relative"
      style={{
        backgroundColor: "#bacbe6",
        boxShadow:
          "4px -4px 10px -2px rgba(0,0,0,0.1), -4px 4px 10px -2px rgba(0,0,0,0.1), 0 -4px 10px -2px rgba(0,0,0,0.1)",
      }}
    >
      <div className="position-absolute top-0 end-0">
        <OverlayTrigger placement="left" overlay={renderTooltip}>
          <Link to="/login" className="text-decoration-none text-dark">
            <IoIosLogIn className="login-icon" />
          </Link>
        </OverlayTrigger>
      </div>

      <div className="header">
        <div className="row">
          <div className="col-lg-3 col-sm-12 text-center">
            <img
              src={DepedLogo}
              alt="depedCabuyaoHeader"
              style={{ width: "200px" }}
              className="img"
            />
          </div>
          <div className="col-lg-9 col-sm-12">
            <p className="sdo mt-3">
              <b>SDO Cabuyao</b> Client Satisfaction Measurement (CSM){" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
        <div className="row">
          <p className="p1">
            The Client Satisfaction (CSM) tracks the customer experience of
            government offices. Your feedback on your recently concluded
            transaction will help this office provide better service. Personal
            information shared will be kept confidential and you always have the
            option to not answer this form.
          </p>
        </div>
        <div className="row">
          <div className="row">
            <div className="col p2">
              <p className="m-0">ANTI-RED TAPE AUTHORITY</p>
              <p className="m-0">PSA Approval No. ARTA-2242-3</p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="container p-5">
        <div className="row">
          <div className="col-5 w-25">
            <img
              src={DepedLogo}
              alt="depedCabuyaoHeader"
              style={{ width: "200px" }}
            />
          </div>
          <div className="col-7" style={{ fontSize: "35px" }}>
            <p className="mt-3">
              <b>SDO Cabuyao</b> Client Satisfaction Measurement (CSM) 2025
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>
              The Client Satisfaction (CSM) tracks the customer experience of
              government offices. Your feedback on your recently concluded
              transaction will help this office provide better service. Personal
              information shared will be kept confidential and you always have
              the option to not answer this form.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p className="m-0">ANTI-RED TAPE AUTHORITY</p>
            <p className="m-0">PSA Approval No. ARTA-2242-3</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default header;
