import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {
      const url = new URL(req.url);
      const user_email: string = url.searchParams.get("user_email")?.trim() || "";    

      const rows = await pool.request()
        .input("user_email", sql.VarChar, user_email?.trim())
        .query('SELECT * FROM Applications WHERE user_email = @user_email');

      if (rows.recordset.length === 0) {
        return NextResponse.json(
          {applications:[],
             message: 'Application(s) not found' },
          { status: 400 }
        );
      }
      
      const applications = rows.recordset;
      return NextResponse.json(
        { applications },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message },
        { status: 500 }
      );
    }
  }