import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import validator from "validator";

export const POST = async (req: Request) => {
  let requestData: any;

  try {
    // Parse JSON payload safely
    requestData = await req.json();
    console.log("Received data:", requestData);
  } catch (parseError) {
    console.error("Failed to parse JSON:", parseError);
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 }
    );
  }
  console.log("Received data:", requestData);

  const { fullnames, empno, email, districtId } = requestData;

  // Validate required fields
  if (!fullnames || !empno || !email || !districtId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!validator.isEmail(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }

  const pool = await connectToDatabase();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Check if table exists, and create it if it doesn't
    const createTableSQL = `
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Originators' AND TABLE_SCHEMA = 'dbo'
      )
      BEGIN
        CREATE TABLE dbo.Originators (
          id INT IDENTITY(1,1) PRIMARY KEY,
          fullnames VARCHAR(255) NOT NULL,
          empno VARCHAR(100) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          districtId VARCHAR(100) NOT NULL,
          create_date DATETIME NOT NULL DEFAULT GETDATE(),
          last_update DATETIME NOT NULL DEFAULT GETDATE()
        )
      END
    `;

    await request.query(createTableSQL);

    // Insert data
    const result = await request
      .input("fullnames", sql.VarChar, fullnames.trim())
      .input("empno", sql.VarChar, empno.trim())
      .input("email", sql.VarChar, email.trim())
      .input("districtId", sql.VarChar, districtId.trim())
      .query(`
        INSERT INTO Originators
          (fullnames, empno, email, districtId, create_date,last_update)
        OUTPUT inserted.id
        VALUES (@fullnames, @empno, @email, @districtId, GETDATE(), GETDATE())
      `);

    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      await transaction.rollback();
      return NextResponse.json(
        { message: "Failed to add Loan Originator" },
        { status: 500 }
      );
    }

    await transaction.commit();

    const insertedId = result.recordset[0]?.id;

    return NextResponse.json(
      {
        message: "Loan Originator added successfully",
        originatorId: insertedId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database error:", error);

    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Transaction rollback failed:", rollbackError);
    }

    if (
      error.message.includes("Violation of UNIQUE KEY constraint") ||
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json(
        { message: "Email or Employee number already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await pool.close();
  }
};
