import pool from "../db.js";

export const addDivision = async (req, res) => {
  const { division_name, description } = req.body;

  try {
    const [existingDivision] = await pool.execute(
      "SELECT * FROM division WHERE LOWER(division_name) = LOWER(?)",
      [division_name]
    );
    if (existingDivision.length > 0) {
      return res.status(400).json({ message: "Division already exists" });
    }

    await pool.execute(
      "INSERT INTO division (division_name, description) VALUES (?, ?)",
      [division_name, description]
    );

    res.status(201).json({ message: "Division added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDivision = async (req, res) => {
  const { division_name, description, division_id } = req.body;

  try {
    const [existingDivision] = await pool.execute(
      "SELECT * FROM division WHERE LOWER(division_name) = LOWER(?)",
      [division_name]
    );
    if (existingDivision.length > 0) {
      return res.status(400).json({ message: "Division already exists" });
    }

    await pool.execute(
      "UPDATE division SET division_name = ?, description = ? WHERE division_id = ?",
      [division_name, description, division_id]
    );

    res.status(201).json({ message: "Division updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDivisions = async (req, res) => {
  try {
    const [divisions] = await pool.execute("SELECT * FROM division");
    res.json(divisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getServices = async (req, res) => {
  const divisionId = req.query.divisionId ?? null;
  const subDivisionId = req.query.subDivisionId ?? null;

  if (!divisionId && !subDivisionId) {
    return res
      .status(400)
      .json({ message: "Either divisionId or subDivisionId is required" });
  }

  try {
    let query = "";
    let params = [];

    if (subDivisionId) {
      query =
        "SELECT service_id, service_name FROM services WHERE fk_sub_division_id = ?";
      params = [subDivisionId];
      console.log("Using subDivisionId:", subDivisionId);
    } else if (divisionId) {
      query =
        "SELECT service_id, service_name FROM services WHERE fk_division_id = ?";
      params = [divisionId];
      console.log("Using divisionId:", divisionId);
    }

    const [services] = await pool.execute(query, params);
    console.log("Query results:", services);
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubDivision = async (req, res) => {
  try {
    const [sub_division] = await pool.execute("SELECT * FROM sub_division");
    res.json(sub_division);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getFeedbackByDivision = async (req, res) => {
//   const { division_id } = req.params;

//   try {
//     const [feedback] = await pool.execute(
//       `SELECT
//         c.age,
//         c.gender,
//         c.customer_type,
//         f.service,
//         f.charter_one,
//         f.charter_two,
//         f.charter_three,
//         MAX(IF(q.label = 'SQD1 - Responsive', fa.answer_value, NULL)) AS SQD1,
//         MAX(IF(q.label = 'SQD2 - Reliability', fa.answer_value, NULL)) AS SQD2,
//         MAX(IF(q.label = 'SQD3 - Access and Facilities', fa.answer_value, NULL)) AS SQD3,
//         MAX(IF(q.label = 'SQD4 - Communication', fa.answer_value, NULL)) AS SQD4,
//         MAX(IF(q.label = 'SQD5 - Costs', fa.answer_value, NULL)) AS SQD5,
//         MAX(IF(q.label = 'SQD6 - Integrity', fa.answer_value, NULL)) AS SQD6,
//         MAX(IF(q.label = 'SQD7 - Assurance', fa.answer_value, NULL)) AS SQD7,
//         MAX(IF(q.label = 'SQD8 - Outcome', fa.answer_value, NULL)) AS SQD8,
//         f.remarks,
//         f.created_at
//       FROM feedback f
//       JOIN customer c ON c.customer_id = f.fk_customer
//       LEFT JOIN feedback_answers fa ON fa.fk_feedback = f.feedback_id
//       LEFT JOIN questions q ON q.questions_id = fa.fk_questions
//       WHERE f.fk_division = ?
//       GROUP BY f.feedback_id
//       ORDER BY f.created_at DESC`,
//       [division_id]
//     );

//     const mappedFeedback = feedback.map((item) => ({
//       ...item,
//       customer_type:
//         item.customer_type === 1
//           ? "Business"
//           : item.customer_type === 2
//           ? "Citizen"
//           : item.customer_type === 3
//           ? "Government"
//           : "Unknown",
//     }));

//     res.json(mappedFeedback);
//   } catch (error) {
//     console.error("Error getting feedback by division:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const insertFeedback = async (req, res) => {
  const {
    age,
    gender,
    type,
    divisionId,
    subDivisionId,
    serviceId,
    service,
    chart1,
    chart2,
    chart3,
    remarks,
    created_at,
    answers,
  } = req.body;

  if (!age || !gender || !type || !divisionId || !service || !created_at) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const [customerResult] = await pool.execute(
      `INSERT INTO customer (age, gender, customer_type) 
       VALUES (?, ?, ?)`,
      [age, gender, type]
    );
    const customerId = customerResult.insertId;

    if (!customerId) {
      return res.status(400).json({ message: "Failed to create customer." });
    }
    //18
    const [feedbackResult] = await pool.execute(
      `INSERT INTO feedback (
        fk_customer, fk_division, fk_subdivision, fk_service, service, 
        charter_one, charter_two, charter_three, remarks, created_at
      ) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        customerId,
        divisionId,
        subDivisionId,
        serviceId,
        service,
        chart1,
        chart2,
        chart3,
        remarks,
        created_at,
      ]
    );

    const feedbackId = feedbackResult.insertId;

    if (Array.isArray(answers)) {
      const values = answers.map((ans) => [
        feedbackId,
        ans.questionId,
        ans.value,
      ]);
      await pool.query(
        `INSERT INTO feedback_answers (fk_feedback, fk_questions, answer_value)
         VALUES ?`,
        [values]
      );
    }

    if (feedbackResult.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to add feedback." });
    }

    res.status(201).json({ message: "Feedback added successfully" });
  } catch (error) {
    console.error("Error inserting feedback:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getServicesAndSubdivisions = async (req, res) => {
  const division_id = req.params.division_id;

  if (!division_id) {
    return res.status(400).json({ message: "division_id is required" });
  }

  try {
    const query = `
     SELECT 
    d.division_id,
    sd.sub_division_id,
    d.division_name,
    sd.sub_division_name,
    s.service_id,
    s.service_name
      FROM 
          division d
      LEFT JOIN 
          sub_division sd ON d.division_id = sd.parent_id
      LEFT JOIN 
          services s ON sd.sub_division_id = s.fk_sub_division_id OR d.division_id = s.fk_division_id
      WHERE 
          d.division_id = ?
      GROUP BY 
          d.division_id, sd.sub_division_id, 
          d.division_name, 
          sd.sub_division_name, s.service_id, s.service_name;
    `;

    const [results] = await pool.execute(query, [division_id]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given division_id" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching services and subdivisions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const getFeedBackData = async (req, res) => {
//   const { fk_division, fk_subdivision, fk_service, customer_type } = req.query;

//   if (!fk_division || !fk_service) {
//     return res.status(400).json({
//       message: "fk_division and fk_service are required",
//     });
//   }

//   try {
//     const query = `
//      SELECT
//         f.fk_division AS division_id,
//         f.fk_subdivision AS subdivision_id,
//         q.questions_id,
//         q.questions_text,
//         AVG(a.answer_value) AS average_score,
//         COUNT(DISTINCT f.fk_customer) AS total_respondents,
//         SUM(CASE WHEN c.gender = 'male' THEN 1 ELSE 0 END) AS total_males,
//         SUM(CASE WHEN c.gender = 'female' THEN 1 ELSE 0 END) AS total_females,
//         CASE
//           WHEN c.age BETWEEN 19 AND 25 THEN '19-25'
//           WHEN c.age BETWEEN 26 AND 35 THEN '26-35'
//           WHEN c.age BETWEEN 36 AND 45 THEN '36-45'
//           ELSE '46+'
//         END AS age_bracket,
//         c.customer_type,
//         s.service_name AS service_availed
//       FROM feedback_answers a
//       JOIN feedback f ON f.feedback_id = a.fk_feedback
//       JOIN questions q ON q.questions_id = a.fk_questions
//       JOIN customer c ON c.customer_id = f.fk_customer
//       LEFT JOIN services s ON s.service_id = f.fk_service
//       WHERE f.fk_division = ?
//         AND (f.fk_subdivision = ? OR f.fk_subdivision IS NULL)
//         AND f.fk_service = ?
//         AND c.customer_type = ?
//       GROUP BY
//         f.fk_division,
//         f.fk_subdivision,
//         q.questions_id,
//         q.questions_text,
//         CASE
//           WHEN c.age BETWEEN 19 AND 25 THEN '19-25'
//           WHEN c.age BETWEEN 26 AND 35 THEN '26-35'
//           WHEN c.age BETWEEN 36 AND 45 THEN '36-45'
//           ELSE '46+'
//         END,
//         c.customer_type,
//         s.service_name
//       ORDER BY
//         f.fk_division,
//         f.fk_subdivision,
//         q.questions_id;
//     `;

//     const [results] = await pool.query(query, [
//       fk_division,
//       fk_subdivision,
//       fk_subdivision,
//       fk_service,
//       customer_type,
//     ]);

//     let totalSqd = {
//       total_sqd1: 0,
//       total_sqd2: 0,
//       total_sqd3: 0,
//       total_sqd4: 0,
//       total_sqd5: 0,
//       total_sqd6: 0,
//       total_sqd7: 0,
//       total_sqd8: 0,
//     };

//     results.forEach((row) => {
//       totalSqd.total_sqd1 += Number(row.sqd1) || 0;
//       totalSqd.total_sqd2 += Number(row.sqd2) || 0;
//       totalSqd.total_sqd3 += Number(row.sqd3) || 0;
//       totalSqd.total_sqd4 += Number(row.sqd4) || 0;
//       totalSqd.total_sqd5 += Number(row.sqd5) || 0;
//       totalSqd.total_sqd6 += Number(row.sqd6) || 0;
//       totalSqd.total_sqd7 += Number(row.sqd7) || 0;
//       totalSqd.total_sqd8 += Number(row.sqd8) || 0;
//     });

//     res.status(200).json({
//       summary: totalSqd,
//       details: results,
//     });
//   } catch (error) {
//     console.error("Error fetching feedback data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getFeedbackByDivision = async (req, res) => {
  const { division_id } = req.params;
  const { customer_type, service, subdivision_id, start_date, end_date } =
    req.query;

  try {
    let baseQuery = `
      SELECT 
        c.age,
        c.gender,
        c.customer_type,
        f.service,
        f.fk_subdivision,
        sd.sub_division_name, 
        f.charter_one,
        f.charter_two,
        f.charter_three,
        MAX(IF(q.label = 'SQD1 - Responsive', fa.answer_value, NULL)) AS SQD1,
        MAX(IF(q.label = 'SQD2 - Reliability', fa.answer_value, NULL)) AS SQD2,
        MAX(IF(q.label = 'SQD3 - Access and Facilities', fa.answer_value, NULL)) AS SQD3,
        MAX(IF(q.label = 'SQD4 - Communication', fa.answer_value, NULL)) AS SQD4,
        MAX(IF(q.label = 'SQD5 - Costs', fa.answer_value, NULL)) AS SQD5,
        MAX(IF(q.label = 'SQD6 - Integrity', fa.answer_value, NULL)) AS SQD6,
        MAX(IF(q.label = 'SQD7 - Assurance', fa.answer_value, NULL)) AS SQD7,
        MAX(IF(q.label = 'SQD8 - Outcome', fa.answer_value, NULL)) AS SQD8,
        f.remarks,
        f.created_at
      FROM feedback f
      JOIN customer c ON c.customer_id = f.fk_customer
      LEFT JOIN sub_division sd ON sd.sub_division_id = f.fk_subdivision  
      LEFT JOIN feedback_answers fa ON fa.fk_feedback = f.feedback_id
      LEFT JOIN questions q ON q.questions_id = fa.fk_questions
      WHERE f.fk_division = ?
    `;

    const params = [division_id];

    if (customer_type) {
      baseQuery += " AND c.customer_type = ?";
      params.push(customer_type);
    }

    if (service) {
      baseQuery += " AND f.service = ?";
      params.push(service);
    }

    if (subdivision_id) {
      baseQuery += " AND sd.sub_division_name = ?";
      params.push(subdivision_id);
    }

    if (start_date && end_date) {
      baseQuery +=
        " AND DATE(f.created_at) >= DATE(?) AND DATE(f.created_at) <= DATE(?)";
      params.push(start_date, end_date);
    }

    baseQuery += `
      GROUP BY f.feedback_id
      ORDER BY f.created_at DESC
    `;

    const [feedback] = await pool.execute(baseQuery, params);

    res.json(feedback);
  } catch (error) {
    console.error("Error getting feedback by division:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerStats = async (req, res) => {
  // Get parameters from query string instead of body
  const {
    fk_division,
    fk_service,
    fk_subdivision,
    customer_type,
    startDate,
    endDate,
  } = req.query;

  if (!fk_division || !fk_service) {
    return res.status(400).json({
      message: "fk_division and fk_service are required",
    });
  }

  try {
    const query = `
      SELECT
        SUM(CASE WHEN c.gender = 'Male' THEN 1 ELSE 0 END) AS total_male,
        SUM(CASE WHEN c.gender = 'Female' THEN 1 ELSE 0 END) AS total_female,
        COUNT(CASE WHEN c.age <= 19 THEN 1 END) AS total_age_19_lower,
        COUNT(CASE WHEN c.age BETWEEN 20 AND 34 THEN 1 END) AS total_age_20_34,
        COUNT(CASE WHEN c.age BETWEEN 35 AND 49 THEN 1 END) AS total_age_35_49,
        COUNT(CASE WHEN c.age BETWEEN 50 AND 64 THEN 1 END) AS total_age_50_64,
        COUNT(CASE WHEN c.age >= 65 THEN 1 END) AS total_age_65_higher
      FROM
        customer c
      JOIN
        feedback f ON c.customer_id = f.fk_customer
      WHERE
        f.fk_division = ? 
        AND (f.fk_service = ? OR ? IS NULL) 
        AND (f.fk_subdivision = ? OR f.fk_subdivision IS NULL)
        AND (c.customer_type = ? OR ? IS NULL)
        AND DATE(f.created_at) BETWEEN ? AND LAST_DAY(?)
      GROUP BY
        f.fk_division;
    `;

    const [results] = await pool.execute(query, [
      fk_division,
      fk_service || null,
      fk_service || null, // Handle fk_service being null in SQL
      fk_subdivision || null,
      customer_type || null,
      customer_type || null, // Handle customer_type being null in SQL
      startDate,
      endDate || "9999-12-31", // Default to a far future date if endDate is not provided
    ]);

    res.json(results[0] || {});
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSurveyResults = async (req, res) => {
  // Get parameters from query string instead of body
  const {
    fk_division,
    fk_service,
    fk_subdivision,
    customer_type,
    startDate,
    endDate,
  } = req.query;

  if (!fk_division || !fk_service) {
    return res.status(400).json({
      message: "fk_division and fk_service are required",
    });
  }

  try {
    const query = `
      WITH filtered_answers AS (
          SELECT fa.*
          FROM feedback_answers fa
          JOIN feedback f ON f.feedback_id = fa.fk_feedback
          JOIN customer c ON c.customer_id = f.fk_customer
          WHERE
              f.fk_division = ?
              AND (f.fk_service = ? OR ? IS NULL)
              AND (f.fk_subdivision = ? OR f.fk_subdivision IS NULL)
              AND (c.customer_type = ? OR ? IS NULL)
              AND DATE(f.created_at) BETWEEN ? AND LAST_DAY(?)
      )

      SELECT
          -- SQD1 - Responsiveness
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD1_5,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD1_4,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD1_3,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD1_2,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD1_1,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD1_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 1 THEN fk_feedback END) AS SQD1_total_respondents,
          SUM(CASE WHEN fk_questions = 1 THEN answer_value ELSE 0 END) AS SQD1_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 1 THEN answer_value END), 2) AS SQD1_avg,

          -- SQD2 - Reliability
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD2_5,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD2_4,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD2_3,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD2_2,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD2_1,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD2_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 2 THEN fk_feedback END) AS SQD2_total_respondents,
          SUM(CASE WHEN fk_questions = 2 THEN answer_value ELSE 0 END) AS SQD2_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 2 THEN answer_value END), 2) AS SQD2_avg,

          -- SQD3 - Access and Facilities
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD3_5,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD3_4,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD3_3,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD3_2,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD3_1,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD3_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 3 THEN fk_feedback END) AS SQD3_total_respondents,
          SUM(CASE WHEN fk_questions = 3 THEN answer_value ELSE 0 END) AS SQD3_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 3 THEN answer_value END), 2) AS SQD3_avg,

          -- SQD4 - Communication
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD4_5,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD4_4,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD4_3,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD4_2,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD4_1,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD4_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 4 THEN fk_feedback END) AS SQD4_total_respondents,
          SUM(CASE WHEN fk_questions = 4 THEN answer_value ELSE 0 END) AS SQD4_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 4 THEN answer_value END), 2) AS SQD4_avg,

          -- SQD5 - Costs
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD5_5,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD5_4,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD5_3,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD5_2,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD5_1,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD5_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 5 THEN fk_feedback END) AS SQD5_total_respondents,
          SUM(CASE WHEN fk_questions = 5 THEN answer_value ELSE 0 END) AS SQD5_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 5 THEN answer_value END), 2) AS SQD5_avg,

          -- SQD6 - Integrity
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD6_5,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD6_4,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD6_3,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD6_2,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD6_1,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD6_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 6 THEN fk_feedback END) AS SQD6_total_respondents,
          SUM(CASE WHEN fk_questions = 6 THEN answer_value ELSE 0 END) AS SQD6_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 6 THEN answer_value END), 2) AS SQD6_avg,

          -- SQD7 - Assurance
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD7_5,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD7_4,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD7_3,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD7_2,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD7_1,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD7_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 7 THEN fk_feedback END) AS SQD7_total_respondents,
          SUM(CASE WHEN fk_questions = 7 THEN answer_value ELSE 0 END) AS SQD7_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 7 THEN answer_value END), 2) AS SQD7_avg,

          -- SQD8 - Outcome
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD8_5,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD8_4,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD8_3,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD8_2,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD8_1,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD8_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 8 THEN fk_feedback END) AS SQD8_total_respondents,
          SUM(CASE WHEN fk_questions = 8 THEN answer_value ELSE 0 END) AS SQD8_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 8 THEN answer_value END), 2) AS SQD8_avg,

          -- Overall Average Score
          ROUND(AVG(answer_value), 2) AS overall_avg,

          CASE 
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 4.5 AND 5.0 THEN 'Outstanding'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 3.5 AND 4.49 THEN 'Very Satisfactory'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 2.5 AND 3.49 THEN 'Satisfactory'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 1.5 AND 2.49 THEN 'Unsatisfactory'
              ELSE 'Poor'
          END AS descriptive_rating

      FROM filtered_answers;

    `;

    const [results] = await pool.execute(query, [
      fk_division,
      fk_service || null,
      fk_service || null, // Handle fk_service being null in SQL
      fk_subdivision || null,
      customer_type || null,
      customer_type || null, // Handle customer_type being null in SQL
      startDate,
      endDate, // Default to a far future date if endDate is not provided
    ]);

    res.json(results[0] || {});
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCustomerStatsMonth = async (req, res) => {
  // Get parameters from query string instead of body
  const { fk_division, fk_subdivision, month, year } = req.query;

  try {
    const query = `
      SELECT
        SUM(CASE WHEN c.gender = 'Male' THEN 1 ELSE 0 END) AS total_male,
        SUM(CASE WHEN c.gender = 'Female' THEN 1 ELSE 0 END) AS total_female,
        COUNT(CASE WHEN c.age <= 19 THEN 1 END) AS total_age_19_lower,
        COUNT(CASE WHEN c.age BETWEEN 20 AND 34 THEN 1 END) AS total_age_20_34,
        COUNT(CASE WHEN c.age BETWEEN 35 AND 49 THEN 1 END) AS total_age_35_49,
        COUNT(CASE WHEN c.age BETWEEN 50 AND 64 THEN 1 END) AS total_age_50_64,
        COUNT(CASE WHEN c.age >= 65 THEN 1 END) AS total_age_65_higher,
        COUNT(CASE WHEN c.customer_type = 'Business' THEN 1 END) AS total_business,
        COUNT(CASE WHEN c.customer_type = 'Citizen' THEN 1 END) AS total_citizen,
        COUNT(CASE WHEN c.customer_type = 'Government' THEN 1 END) AS total_government
      FROM
        customer c
      JOIN
        feedback f ON c.customer_id = f.fk_customer
      WHERE
        f.fk_division = ?
        AND (f.fk_subdivision = ? OR f.fk_subdivision IS NULL)
        AND MONTH(f.created_at) = ?
        AND YEAR(f.created_at) = ?
    `;

    const [results] = await pool.execute(query, [
      fk_division,
      fk_subdivision,
      month,
      year,
    ]);

    res.json(results[0] || {});
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSurveyResultsMonth = async (req, res) => {
  // Get parameters from query string instead of body
  const { fk_division, fk_subdivision, month, year } = req.query;

  try {
    const query = `
      WITH filtered_answers AS (
          SELECT fa.*
          FROM feedback_answers fa
          JOIN feedback f ON f.feedback_id = fa.fk_feedback
          JOIN customer c ON c.customer_id = f.fk_customer
          WHERE
              f.fk_division = ? 
              AND (f.fk_subdivision = ? OR f.fk_subdivision IS NULL)
              AND MONTH(f.created_at) = ?  -- January (1)
              AND YEAR(f.created_at) = ? -- Year 2025'
      )

      SELECT
          -- SQD1 - Responsiveness
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD1_5,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD1_4,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD1_3,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD1_2,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD1_1,
          SUM(CASE WHEN fk_questions = 1 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD1_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 1 THEN fk_feedback END) AS SQD1_total_respondents,
          SUM(CASE WHEN fk_questions = 1 THEN answer_value ELSE 0 END) AS SQD1_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 1 THEN answer_value END), 2) AS SQD1_avg,

          -- SQD2 - Reliability
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD2_5,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD2_4,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD2_3,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD2_2,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD2_1,
          SUM(CASE WHEN fk_questions = 2 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD2_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 2 THEN fk_feedback END) AS SQD2_total_respondents,
          SUM(CASE WHEN fk_questions = 2 THEN answer_value ELSE 0 END) AS SQD2_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 2 THEN answer_value END), 2) AS SQD2_avg,

          -- SQD3 - Access and Facilities
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD3_5,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD3_4,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD3_3,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD3_2,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD3_1,
          SUM(CASE WHEN fk_questions = 3 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD3_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 3 THEN fk_feedback END) AS SQD3_total_respondents,
          SUM(CASE WHEN fk_questions = 3 THEN answer_value ELSE 0 END) AS SQD3_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 3 THEN answer_value END), 2) AS SQD3_avg,

          -- SQD4 - Communication
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD4_5,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD4_4,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD4_3,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD4_2,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD4_1,
          SUM(CASE WHEN fk_questions = 4 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD4_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 4 THEN fk_feedback END) AS SQD4_total_respondents,
          SUM(CASE WHEN fk_questions = 4 THEN answer_value ELSE 0 END) AS SQD4_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 4 THEN answer_value END), 2) AS SQD4_avg,

          -- SQD5 - Costs
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD5_5,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD5_4,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD5_3,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD5_2,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD5_1,
          SUM(CASE WHEN fk_questions = 5 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD5_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 5 THEN fk_feedback END) AS SQD5_total_respondents,
          SUM(CASE WHEN fk_questions = 5 THEN answer_value ELSE 0 END) AS SQD5_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 5 THEN answer_value END), 2) AS SQD5_avg,

          -- SQD6 - Integrity
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD6_5,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD6_4,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD6_3,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD6_2,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD6_1,
          SUM(CASE WHEN fk_questions = 6 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD6_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 6 THEN fk_feedback END) AS SQD6_total_respondents,
          SUM(CASE WHEN fk_questions = 6 THEN answer_value ELSE 0 END) AS SQD6_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 6 THEN answer_value END), 2) AS SQD6_avg,

          -- SQD7 - Assurance
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD7_5,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD7_4,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD7_3,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD7_2,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD7_1,
          SUM(CASE WHEN fk_questions = 7 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD7_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 7 THEN fk_feedback END) AS SQD7_total_respondents,
          SUM(CASE WHEN fk_questions = 7 THEN answer_value ELSE 0 END) AS SQD7_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 7 THEN answer_value END), 2) AS SQD7_avg,

          -- SQD8 - Outcome
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 5 THEN 1 ELSE 0 END) AS SQD8_5,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 4 THEN 1 ELSE 0 END) AS SQD8_4,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 3 THEN 1 ELSE 0 END) AS SQD8_3,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 2 THEN 1 ELSE 0 END) AS SQD8_2,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 1 THEN 1 ELSE 0 END) AS SQD8_1,
          SUM(CASE WHEN fk_questions = 8 AND answer_value = 0 THEN 1 ELSE 0 END) AS SQD8_0,
          COUNT(DISTINCT CASE WHEN fk_questions = 8 THEN fk_feedback END) AS SQD8_total_respondents,
          SUM(CASE WHEN fk_questions = 8 THEN answer_value ELSE 0 END) AS SQD8_total_score,
          ROUND(AVG(CASE WHEN fk_questions = 8 THEN answer_value END), 2) AS SQD8_avg,

          -- Overall Average Score
          ROUND(AVG(answer_value), 2) AS overall_avg,

          CASE 
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 4.5 AND 5.0 THEN 'O'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 3.5 AND 4.49 THEN 'VS'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 2.5 AND 3.49 THEN 'S'
              WHEN ROUND(AVG(answer_value), 1) BETWEEN 1.5 AND 2.49 THEN 'US'
              ELSE 'P'
          END AS descriptive_rating

      FROM filtered_answers;

    `;

    const [results] = await pool.execute(query, [
      fk_division,
      fk_subdivision || null,
      month,
      year,
    ]);

    res.json(results[0] || {});
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
