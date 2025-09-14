import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {

      const rows = await pool.request()
        .query('SELECT * FROM Districts');

      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'Districts(s) not found' },
          { status: 400 }
        );
      }
      const Districts = rows.recordset;
      return NextResponse.json(
        { Districts: Districts },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message },
        { status: 500 }
      );
    }
  }