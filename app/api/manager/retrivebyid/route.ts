import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    const url = new URL(req.url);
    const id: string = url.searchParams.get("id")?.trim() || "";
    try {
      const rows = await pool.request()
      .input('id',sql.Int,parseInt(id.trim()))
        .query(`SELECT user_email,first_name,last_name,phone,empno,districtId,active,create_date FROM Managers where id=@id`);
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'manager not found',
            Manager:''
           },
          { status: 400 }
        );
      }
      const Manager = rows.recordset[0];
      return NextResponse.json(
        { Manager: Manager },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message,
        Manager:''
         },
        { status: 500 }
      );
    }
  }