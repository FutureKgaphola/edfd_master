import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {
      const url = new URL(req.url);
    const reg: string = url.searchParams.get("reg")?.trim() || "";    
      // Query the database for the user by email
      const rows = await pool.request()
        .input("reg", sql.VarChar, reg?.trim())
        .query('SELECT TOP 1 * FROM CompaniesIdentification WHERE regNo = @reg');
      
      // Check if the companies were found
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'Companie(s) not found' },
          { status: 400 }
        );
      }
      const company = rows.recordset[0];
      return NextResponse.json(
        { company: company },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message },
        { status: 500 }
      );
    }
  }