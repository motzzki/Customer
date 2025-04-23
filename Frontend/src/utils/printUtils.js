import headerLogo from "../assets/Images/image.png";

export const handlePrint = (dataArray, questions) => {
  const { summary, details } = dataArray;
  console.log("handlePrint called with:", { dataArray, questions });

  const validQuestions = Array.isArray(questions) ? questions : [];

  const generateTableRows = () => {
    if (validQuestions.length === 0) {
      return `
        <tr>
          <td colspan="3">No question data available</td>
        </tr>
      `;
    }

    return validQuestions
      .map((question, index) => {
        const totalValue = Number(summary?.[`total_sqd${index + 1}`]) || 0;

        return `
          <tr>
            <td>${question.questions_text || question.text || ""}</td>
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
        <b>Age Brackets:</b> ${[...ageBrackets].join(", ")} |
        <b>Total Male:</b> ${maleTotal} |
        <b>Total Female:</b> ${femaleTotal}
      </div>
    `;
  };

  const printContent = `
  <html>
    <head>
      <title>Customer Feedback Report</title>
      <style>
        @page {
          size: legal;
          margin: 10mm;
        }

        body {
          font-family: "Bookman Old Style", "Georgia", serif;
          font-size: 1em;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          line-height: 1.4;
        }

        .report-header {
          text-align: center;
          padding: 5px 0;
        }

        .report-header img {
          width: 15em;
        }

        .report-header hr {
          border: 1px solid black;
          margin: 5px 0;
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
          font-size: 1em; /* Slightly larger font for better readability */
          table-layout: fixed; /* Ensures equal column distribution */
        }

        th, td {
          border: 1px solid black;
          padding: 10px; 
          text-align: center;
          word-wrap: break-word;
          height: 3em; /* Ensures consistent row height */
        }

        th {
          background-color: #f2f2f2;
        }

        th, td {
          width: 33.33%; /* Distributes columns evenly */
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
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="page-content">
        <div class="report-header">
          <img src="${image}" alt="Header Logo" />
          <hr />
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
          <div>
            <b>Client Type:</b>
            <span class="serviceName">${clientType}</span>
          </div>
        </div>

        <div>
          ${generateDemographics(details)}
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
             ${generateTableRows()}
             <tr>
               <td colspan="2"><b>Total Number of Respondents</b></td>
               <td colspan="1"><b>
               ${details.reduce(
                 (acc, item) =>
                   acc +
                   (Number(item.maleCount || item.total_males) || 0) +
                   (Number(item.femaleCount || item.total_females) || 0),
                 0
               )}</b></td>
             </tr>
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
    </body>
  </html>
  `;

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
