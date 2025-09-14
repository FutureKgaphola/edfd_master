import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const PUT = async (req: Request) => {
  try {
    const { id } = await req.json();

    // Validate input
    if (!id) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("status", sql.Int, 0)
      .query(`
        UPDATE Districts
        SET status = @status,
            DateTimeDeleted = GETDATE()
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: "District not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "District Deleted successfully" }, { status: 200 });

  } catch (error: any) {
    if (
      error.message.includes("Violation of UNIQUE KEY constraint") ||
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json({ message: "District name already exists" }, { status: 409 });
    }

    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

const isValidData = (districtName: string) => {
  return typeof districtName === "string" && districtName.trim().length > 0;
};
