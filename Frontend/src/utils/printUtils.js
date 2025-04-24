import headerLogo from "../assets/Images/knelogo.png";
import depedfooter from "../assets/Images/depedfooter.jpg";
import bagongpilipinas from "../assets/Images/bagongpilipinas.jpg";
import depedsdo from "../assets/Images/depedsdo.jpg";

export const handlePrint = (dataArray, questions) => {
  const { summary, details } = dataArray;
  const depedfooterimg = depedfooter;
  const bagongpilipinasimg = bagongpilipinas;
  const depedsdoimg = depedsdo;

  console.log("handlePrint called with:", { dataArray, questions });

  const validQuestions = Array.isArray(questions) ? questions : [];

  const generateTableRows1to4 = () => {
    if (validQuestions.length === 0) {
      return `
        <tr>
          <td colspan="3">No question data available</td>
        </tr>
      `;
    }

    return validQuestions
  .slice(0, 4) // Slice to only the first 4 questions
  .map((question, index) => {
    const totalValue = Number(summary?.[`total_sqd${index + 1}`]) || 0;

    return `
      <tr>
        <td>${question.label} - ${question.questions_text || question.text || ""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>${totalValue}</b></td>
        <td><b>${totalValue}</b></td>
      </tr>
    `;
  })
  .join("");

  };

  const generateTableRows5to8 = () => {
    if (validQuestions.length === 0) {
      return `
        <tr>
          <td colspan="3">No question data available</td>
        </tr>
      `;
    }

    return validQuestions
  .slice(4, 8) // Slice to only the first 4 questions
  .map((question, index) => {
    const totalValue = Number(summary?.[`total_sqd${index + 1}`]) || 0;

    return `
      <tr style="width: 100%;">
        <td style="width: 25%;">${question.label} - ${question.questions_text || question.text || ""}</td>
        <td style="width: 5%;"></td>
        <td style="width: 5%;"></td>
        <td style="width: 5%;"></td>
        <td style="width: 5%;"></td>
        <td style="width: 5%;"></td>
        <td style="width: 20%;"></td>
        <td style="width: 12.5%;"><b>${totalValue}</b></td>
        <td style="width: 12.5%;"><b>${totalValue}</b></td>
      </tr>
    `;
  })
  .join("");

  };

  const firstItem = details[0] || {};
  const {
    divisionName,
    periodStart,
    periodEnd,
    purposeTransaction,
    clientType,
    image = headerLogo,
  } = firstItem;

  const generateDemographics = (data) => {
    let maleTotal = 0;
    let femaleTotal = 0;
    const ageBrackets = new Set();

    data.forEach((item) => {
      maleTotal += Number(item.maleCount || item.total_males) || 0;
      femaleTotal += Number(item.femaleCount || item.total_females) || 0;
      ageBrackets.add(item.ageBracket || item.age_bracket);
    });

    return `
      <div>
        <b>Sex:</b>
        <b>Male:</b> ${maleTotal}
        <b>Female:</b> ${femaleTotal}
        <b>Age:</b> ${[...ageBrackets].join(", ")} 
      </div>
    `;
  };

  const printContent = `
  <html>
    <head>
      <title>Customer Feedback Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">

      <style>
        @page {
          size: A4;
        }

        body {
          font-size: 1em;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          line-height: 1.4;
          padding-top: 100px;  /* Space for fixed header */
          padding-bottom: 60px; /* Space for fixed footer */
        }

        .report-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 5px 0;
          background-color: white;
          z-index: 1000;
        }

        .report-header p {
          margin: 0;
          padding: 0;
        }

        .report-header img {
          width: 0.76in;
        }

        .report-header hr {
          border: 1px solid black;
          margin: 5px 0;
        }

        .report-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: left;
          font-size: 0.9em;
          padding-top: 1em;
          border-top: 1px solid #000;
          background-color: white;
          z-index: 1000;
        }

        .report-footer .footer-images {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        .report-footer .footer-text {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          font-size: 12px;
        }

        .report-footer .footer-text-head {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          font-size: 12px;
          width: 1in;
        }

        .report-footer p {
          margin: 2px 0;
        }

        /* Ensure the content doesn't get hidden under the fixed header/footer */
        .page-content {
          margin-top: 70px; /* Space for fixed header */
          margin-bottom: 80px; /* Space for fixed footer */
        }

        .section-header {
          text-align: center;
        }

        .section-header b {
          font-size: 1.2em;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1em;
          font-size: 1em;
          table-layout: fixed;
        }

        th, td {
          border: 1px solid black;
          padding: 10px;
          text-align: center;
          word-wrap: break-word;
          height: 3em;
        }

        th {
          background-color: #f2f2f2;
        }

        th, td {
          width: 33.33%;
        }

        th:first-child, td:first-child {
          text-align: left;
        }

        .signature-section {
          margin-top: 2em;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .signature-block {
          text-align: left;
          width: 100%;
          margin-bottom: 1em;
          padding-top: 0.5em;
        }

        .divisionName, .serviceName {
          text-decoration: underline;
          font-weight: bold;
        }

        .old-english {
          font-family: "Old English Text MT", cursive, sans-serif;
        }

        .trajan {
          font-family: 'Trajan Pro', serif;
        }

      </style>
    </head>
    <body>
      <div class="page-content">
        <div class="report-header">
          <img src="${image}" alt="Header Logo" />
          <p class="old-english" style="font-size: 12px">Republic of the Philippines</p>
          <p class="old-english" style="font-size: 18px">Department of Education</p>
          <p class="trajan" style="font-size: 10px">REGION IV-A CALABARZON</p>
          <p class="trajan" style="font-size: 10px">CITY SCHOOL DIVISION OF CABUYAO</p>
          <hr/>
        </div>

        <div class="section-header">
          <div><b>CUSTOMER FEEDBACK REPORT</b></div>
        </div>

        <div style="margin-top: 20px">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <b>Functional Division/Section/Unit:</b>
              <span class="divisionName">${divisionName}</span>
            </div>
            <div>
               <b>PERIOD:<span class="serviceName"> ${periodStart}-${periodEnd}</b></span>
            </div>
          </div>

          <div>
            <b>Purpose of Transaction:</b>
            <span class="serviceName">${purposeTransaction}</span>
          </div>
        </div>

        <div>
          ${generateDemographics(details)}
        </div>
        <div>
          <b>Client Type:</b>
          <span class="serviceName">${clientType}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25%; text-align: center">Survey</th>
              <th style="width: 5%;">5</th>
              <th style="width: 5%;">4</th>
              <th style="width: 5%;">3</th>
              <th style="width: 5%;">2</th>
              <th style="width: 5%;">1</th>
              <th style="width: 20%;">Total Number of Respondents</th>
              <th style="width: 12.5%;">Total Rated Score</th>
              <th style="width: 12.5%;">Total Ave. Score</th>
            </tr>
          </thead>

          <tbody>
             ${generateTableRows1to4()}
          </tbody>
        </table>
        <div style="height: 300px"></div>
        <table>
          <tbody>
             ${generateTableRows5to8()}
          </tbody>
        </table>

        <div class="signature-section">
          <div class="signature-block">
            <div>Prepared by:</div>
            <br>
            <div><b>CHEM JAYDER M. CABUNGCAL</b></div>
            <div><i>Information Technology Officer I</i></div>
          </div>

          <div class="signature-block">
            <div>Noted by:</div>
            <br>
            <div><b>CHRISTOPHER R. DIAZ, CESO V</b></div>
            <div><i>Schools Division Superintendent</i></div>
          </div>
        </div>
      </div>
      <div class="report-footer">
        <div class="footer-images">
          <img src="${depedfooterimg}" alt="Header Logo" style="width: 0.93in"/>
          <img src="${bagongpilipinasimg}" alt="Header Logo" style="width: 0.8in"/>
          <img src="${depedsdoimg}" alt="Header Logo" style="width: 0.58in"/>
        </div>
        <div class="footer-text-head">
          <p><b>Address:</b></p>
          <p><b>Contact No.:</b></p>
          <p><b>Email Address:</b></p>
          <p><b>Website:</b></p>
        </div>
        <div class="footer-text">
          <p> Cabuyao Enterprise Park, Cabuyao Athletes Basic School (CABS) Brgy. Banay-Banay, City of Cabuyao, Laguna</p>
          <p> +63 939 934 0448 / +63 939 934 0450</p>
          <p> division.cabuyao@deped.gov.ph</p>
          <p> depedcabuyao.ph</p>
        </div>
      </div>
    </body>
  </html>
  `;

  // <tr>
  //   <td colspan="2"><b>Total Number of Respondents</b></td>
  //   <td colspan="1"><b>
  //   ${details.reduce(
  //     (acc, item) =>
  //       acc +
  //       (Number(item.maleCount || item.total_males) || 0) +
  //       (Number(item.femaleCount || item.total_females) || 0),
  //     0
  //   )}</b></td>
  // </tr>

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(printContent);
  iframe.contentWindow.document.close();

  iframe.contentWindow.onload = () => {
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
};
