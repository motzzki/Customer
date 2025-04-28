import headerLogo from "../assets/Images/knelogo.png";
import depedfooter from "../assets/Images/depedfooter.jpg";
import bagongpilipinas from "../assets/Images/bagongpilipinas.jpg";
import depedsdo from "../assets/Images/depedsdo.jpg";
import moment from "moment";
import signNiSirChem from "../assets/Images/signNiSirChem.png";
import signNiSirSDS from "../assets/Images/signNiSirSDS.png";

export const handlePrintMonth = (questions, divisionName, startDate, customerStats, results) => {
  const headerLogoImg = headerLogo;
  const depedfooterimg = depedfooter;
  const bagongpilipinasimg = bagongpilipinas;
  const depedsdoimg = depedsdo;

  const division = divisionName;

  console.log("handlePrintMonth called with:", { questions, customerStats });

  const validQuestions = Array.isArray(questions) ? questions : [];

  const generateTableRows1to4 = () => {
    if (validQuestions.length === 0) {
      return `
        <tr>
          <td colspan="3">No question data available</td>
        </tr>
      `;
    }

    return validQuestions.slice(0, 5).map((question, index) => {

    return `
      <tr>
        <td>SQD${question.questions_id} - ${question.questions_text || question.text || ""}</td>
        <td>${results[`SQD${index + 1}_5`]}</td>
        <td>${results[`SQD${index + 1}_4`]}</td>
        <td>${results[`SQD${index + 1}_3`]}</td>
        <td>${results[`SQD${index + 1}_2`]}</td>
        <td>${results[`SQD${index + 1}_1`]}</td>
        <td>${results[`SQD${index + 1}_0`]}</td>
        <td>${results[`SQD${index + 1}_total_respondents`]}<b></b></td>
        <td>${results[`SQD${index + 1}_total_score`]}<b></b></td>
        <td>${results[`SQD${index + 1}_avg`]}<b></b></td>
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
  .slice(5, 8) // Slice to only the first 4 questions
  .map((question, index) => {
    const count = index + 5; // Adjust index for SQD naming (SQD5, SQD6, etc.)

    return `
      <tr style="width: 100%;">
        <td style="width: 25%;">SQD${question.questions_id} - ${question.questions_text || question.text || ""}</td>
        <td style="width: 5%;">${results[`SQD${count}_5`]}</td>
        <td style="width: 5%;">${results[`SQD${count}_4`]}</td>
        <td style="width: 5%;">${results[`SQD${count}_3`]}</td>
        <td style="width: 5%;">${results[`SQD${count}_2`]}</td>
        <td style="width: 5%;">${results[`SQD${count}_1`]}</td>
        <td style="width: 5%;">${results[`SQD${count}_0`]}</td>
        <td style="width: 20%;">${results[`SQD${count}_total_respondents`]}<b></b></td>
        <td style="width: 12.5%;">${results[`SQD${count}_total_score`]}</td>
        <td style="width: 12.5%;">${results[`SQD${count}_avg`]}</td>
      </tr>
    `;
  })
  .join("");

  };


  const printContent = `
  <html>
    <head>
      <title>Customer Feedback Report - ${moment(startDate, "MMMM YYYY").format("MMMM YYYY")} - ${division}</title>

      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">

      <style>
  @page {
    size: Letter;
    margin: 0;
  }
     @media print {

    table {
      font-size: 11pt !important;
    }
    .footer-text, .footer-text-head {
      font-size: 10pt !important;
    }
}

   body {
    margin: 0;
    padding: 0;
    width: 8.5in;
    height: 11in;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Content wrapper that respects internal margins */
  .page-content {
    padding: 100px 50px 80px 50px;
    padding-top: 2.2in;
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
    padding-top: 0.3in;
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
    width: 87.5%;
    margin-left: 0.5in;
  }

  .report-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 99%;
    margin: 0; /* Remove any margin */
    padding: 0.5em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
    font-size: 0.9em;
    z-index: 1000;
    margin-left: 0.1in;
    margin-bottom: 0.1in;
  }

  .report-footer .footer-images {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-right: 10px;
  }

  .report-footer .footer-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 12px;
    font-family: 'Arial', serif;
  }

  .report-footer .footer-text-head {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 12px;
    width: 2in;
    font-family: 'Arial', serif;
  }

  .report-footer p {
    margin: 2px 0;
  }

  .section-header {
    text-align: center;
  }

  .section-header b {
    font-family: 'Bookman Old Style', serif;
    font-size: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
    font-size: 15px;
    table-layout: fixed;
  }

  th, td {
    border: 1px solid black;
    padding: 10px;
    text-align: center;
    word-wrap: break-word;
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

  .divisionName,
  .serviceName {
    text-decoration: underline;
    text-underline-offset: 5px;
    font-weight: bold;
  }

  .old-english {
    font-family: "Old English Text MT", cursive, sans-serif;
  }

  .trajan {
    font-family: 'Trajan Pro', serif;
  }
  .footer-divider {
    position: fixed;
    bottom: 120px; /* Slightly above the footer's top edge */
    left: 0;
    width: 87.9%;
    border: 1px solid black;
    z-index: 999;
    margin-left: 0.5in;
  }
</style>

    </head>
    <body>
      <div class="page-content">
        <div class="report-header">
          <img src="${headerLogoImg}" alt="Header Logo" />
          <p class="old-english" style="font-size: 16px">Republic of the Philippines</p>
          <p class="old-english" style="font-size: 24px">Department of Education</p>
          <p class="trajan" style="font-size: 13px">REGION IV-A CALABARZON</p>
          <p class="trajan" style="font-size: 13px">CITY SCHOOL DIVISION OF CABUYAO</p>
          <hr/>
        </div>

        <div class="section-header">
          <div><b>CUSTOMER FEEDBACK REPORT</b></div>
        </div>

        <div style="margin-top: 20px">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <b>Functional Division/Section/Unit:</b>
              <span class="divisionName">${division}</span>
            </div>
            <div>
               <b>PERIOD: <span class="serviceName">${moment(startDate, "MMMM YYYY").format("MMMM YYYY")}</b></span>
            </div>
          </div>
        </div>

        <div>
          
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <div>
            <b>Sex: <span class="serviceName">Male: ${customerStats.total_male} Female: ${customerStats.total_female}</span></b>
          </div>
          
          <div style="margin-right: 0.4in;">
            <b>Age: 
              19-Lower: <span class="serviceName">${customerStats.total_age_19_lower}</span> 
              20-34: <span class="serviceName">${customerStats.total_age_20_34}</span> 
              35-49: <span class="serviceName">${customerStats.total_age_35_49}</span> 
              50-64: <span class="serviceName">${customerStats.total_age_50_64}</span> 
              65-Higher: <span class="serviceName">${customerStats.total_age_65_higher}</span>
            </b>
          </div>
        </div>
         <div>
              <b>Business: <span class="serviceName">${customerStats.total_business}</span></b>
              <b>Citizen: <span class="serviceName">${customerStats.total_citizen}</span></b>
               <b>Government: <span class="serviceName">${customerStats.total_government}</span></b>
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
              <th style="width: 5%;">0</th>
              <th style="width: 20%;">Total Number of Respondents</th>
              <th style="width: 12.5%;">Total Rated Score</th>
              <th style="width: 12.5%;">Total Ave. Score</th>
            </tr>
          </thead>

          <tbody>
             ${generateTableRows1to4()}
          </tbody>
        </table>
        <div style="height: 400px"></div>
        <table>
          <tbody>
             ${generateTableRows5to8()}
             <tr>
              <td colspan="9">Overall Ratings</td>
              <td>${results.overall_avg}</td>
             </tr>
             <tr>
              <td colspan="9">Descriptive Ratings</td>
              <td>${results.descriptive_rating}</td>
             </tr>
          </tbody>
        </table>

        <div class="signature-section">
          <div class="signature-block">
            <div>Prepared by:</div>
            <br>
            <div>
              <!-- <img src="${signNiSirChem}" alt="Signature" style="position: absolute; left: 100px; top: 1755px; width: 1.5in; height: 0.5in; margin-bottom: 0.2em;" /> -->
            </div>
            <div><b>CHEM JAYDER M. CABUNGCAL</b></div>
            <div><i>Information Technology Officer I</i></div>
          </div>

          <div class="signature-block">
            <div>Noted by:</div>
            <br>
            <div>
               <!-- <img src="${signNiSirSDS}" alt="Signature" style="position: absolute; left: 90px; top: 1855px; width: 1.5in; height: 0.5in; margin-bottom: 0.2em;" /> -->
            </div>
            <div><b>CHRISTOPHER R. DIAZ, CESO V</b></div>
            <div><i>Schools Division Superintendent</i></div>
          </div>
        </div>
      </div>
      <div class="report-footer">
        <hr class="footer-divider" />
        <div class="footer-images">
          <img src="${depedfooterimg}" alt="Header Logo" style="width: 1.23in"/>
          <img src="${bagongpilipinasimg}" alt="Header Logo" style="width: 1.1in"/>
          <img src="${depedsdoimg}" alt="Header Logo" style="width: 0.88in"/>
        </div>
        <div class="footer-text-head">
          <div style="height: 30px;">
            <p><b>Address:</b></p>
          </div>
          
          <p><b>Contact No.:</b></p>
          <p><b>Email Address:</b></p>
          <p><b>Website:</b></p>
        </div>
        <div class="footer-text">
          <div>
            <p> Cabuyao Enterprise Park, Cabuyao Athletes Basic School (CABS) Brgy. Banay-Banay, City of Cabuyao, Laguna</p>
          </div>
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
