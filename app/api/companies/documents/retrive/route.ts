import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET = async (req: Request) => {
  const pool = await connectToDatabase();
  const tables = ["BusinessDocs", "ProcurementDocs", "BuildingDocs", "franchiseeDocs"];
  try {
    const url = new URL(req.url);
    const regNo = url.searchParams.get('regNo');
    const loanCat_id = url.searchParams.get('loanCat_id');
    if (!regNo || !loanCat_id) {
      return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
    }
    // Query the database for the user by email
    if (regNo !== "" && loanCat_id !== "") {
      const rows = await pool.request()
        .input("regNo", sql.VarChar, regNo?.trim())
        .query(`SELECT * FROM ${tables[parseInt(loanCat_id)]} WHERE regNo = @regNo`);

      // Check if the user was found
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'Documents not found/ Does not exist, contact administrator' },
          { status: 200 } //leace this like this. if you return a 400 status it will case the use not to re-render when u switch companies
        );
      }
      const docs = rows.recordset;
      return NextResponse.json(
        { documents: docs },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Unathorized access - empty string query request' },
        { status: 401 }
      );

    }

  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message },
      { status: 500 }
    );
  }
}