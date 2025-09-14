import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {
      const url = new URL(req.url);
      const user_email: string = url.searchParams.get("user_email")?.trim() || "";    
      // Query the database for the user by email
      const rows = await pool.request()
        .input("user_email", sql.VarChar, user_email?.trim())
        .query('SELECT * FROM CompaniesIdentification WHERE user_email = @user_email');
      
      // Check if the companies were found
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'Companie(s) not found' },
          { status: 400 }
        );
      }
      const companies = rows.recordset;
      return NextResponse.json(
        { companies: companies },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message },
        { status: 500 }
      );
    }
  }