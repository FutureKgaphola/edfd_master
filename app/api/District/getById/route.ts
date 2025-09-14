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
        .query(`SELECT districtName FROM Districts where id=@id`);
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'District not found',
            District:''
           },
          { status: 400 }
        );
      }
      const District = rows.recordset[0];
      return NextResponse.json(
        { District: District },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message,
        District:''
         },
        { status: 500 }
      );
    }
  }