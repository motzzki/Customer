import { createPool } from "mysql2";
import { config } from "dotenv";

config();

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
}).promise();

pool.getConnection()
  .then((connection) => {
    console.log("MySQL connection successful!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

export default pool;
