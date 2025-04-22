import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import pool from "./db.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const depedMainPath = path.resolve(__dirname, "..");
const staticFilesPath = path.join(depedMainPath, "Frontend", "dist");
console.log("Static files path:", staticFilesPath);

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    origin: ["https://csm.sdocabuyao.com", "http://localhost:5173"],
  })
);

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/questions", questionRoutes);

// Serve static files from dist directory (including assets)
app.use(express.static(staticFilesPath));

// This ensures asset paths are correctly resolved in the HTML
app.use("/assets", express.static(path.join(staticFilesPath, "assets")));

// Handle SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(staticFilesPath, "index.html"));
});

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("MySQL Connected");
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  }
})();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
