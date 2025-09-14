import sql from "mssql";

const config = {
  user: 'future', // Replace with your SQL Server username
  password: '1234567', // Replace with your SQL Server password
  server: 'localhost', // Replace with your SQL Server host (e.g., localhost or an IP address)
  database: 'edfd', // Replace with your database name
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 50000
  },
  options: {
    encrypt: false, // Use true if connecting to Azure SQL
    trustServerCertificate: true, // Use true for local development
  },
};

export async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err);
    throw err;
  }
}


