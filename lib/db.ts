import { Pool } from "pg";

const pool = new Pool({
  user: process.env.NEXT_PUBLIC_DB_USER,
  host: process.env.NEXT_PUBLIC_DB_HOST, // Keep it as the external host URL from Neon or your actual database host
  database: process.env.NEXT_PUBLIC_DB_DATABASE,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  //@ts-ignore
  port: parseInt(process.env.NEXT_PUBLIC_DB_PORT, 10), // Ensure to parse the port as an integer
  ssl:
    process.env.NEXT_PUBLIC_DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

pool
  .connect()
  .then((client) => {
    console.log("Database connected successfully");
    client.release(); // Release the client after testing
  })
  .catch((error) => {
    console.error("Database connection error:", error.stack);
  });

export default pool;
