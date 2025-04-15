import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import pool from "./db.js";

config();

// Get current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // Dynamically resolve directory

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({ 
  credentials: true, 
  methods: 'GET,POST,PUT,DELETE', 
  origin: "http://csm.sdocabuyao.com" 
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/divisions", divisionRoutes);

// Serve static files from React build (you already set __dirname dynamically)
app.use(express.static(path.join(__dirname, "Frontend", "dist")));

// Handle all other routes by sending index.html (for React app)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
});

// Test DB connection
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("MySQL Connected");
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
})();

// Start server, listen on all IP addresses (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
