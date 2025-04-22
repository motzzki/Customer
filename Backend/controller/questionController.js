import pool from "../db.js";

export const getQuestion = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM questions");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
