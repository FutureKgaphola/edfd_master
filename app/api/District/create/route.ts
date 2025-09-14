import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
export const POST = async (req: Request) => {
  try {
    const { districtName } = await req.json();

    // Validate the input data
    if (!isValidData(districtName)) {
      return NextResponse.json(
        { message: "Invalid form submitted, valid districts are capricorn, mopani, sekhukhune, vhembe, waterberg" },
        { status: 400 }
      );
    }
    const pool = await connectToDatabase();
    const district = await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Districts')
            BEGIN
                CREATE TABLE Districts (
                    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    districtName VARCHAR(255) NOT NULL UNIQUE,
                    status INT NOT NULL DEFAULT 1,
                    DateTimeChanges DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                    DateTimeDeleted DATETIME2 NULL DEFAULT NULL
                );
            END`);
    // Insert the new district into the Districts table
    if (district) {
      await pool
        .request()
        .input("districtName", sql.VarChar, districtName?.trim())
        .query(
          "INSERT INTO Districts (districtName) OUTPUT inserted.* VALUES (@districtName)"
        );
    }
    return NextResponse.json(
      { message: "District created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    if (
      error.message.includes("Violation of UNIQUE KEY constraint") ||
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json(
        { message: "District already exists" },
        { status: 409 }
      );
    }
    // Handle unexpected errors
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
};

const isValidData = (districtName: string): boolean => {
  const validDistricts = ["capricorn", "mopani", "sekhukhune", "vhembe", "waterberg"];
  if (!districtName || !validDistricts.includes(districtName.trim().toLowerCase())) {
    return false;
  }
  return districtName?.trim().length > 0;
};
