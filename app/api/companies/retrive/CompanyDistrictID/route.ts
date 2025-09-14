import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {

      const url= new URL(req.url);
      const email=url.searchParams.get('email');
      const regNo=url.searchParams.get('regNo');
 
      const rows = await pool.request()
        .input("email", sql.VarChar, email?.trim())
        .input("regNo", sql.VarChar, regNo?.trim())
        .query('SELECT districtId FROM CompaniesAddress WHERE holderEmail = @email AND regNo = @regNo');
   
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'District not defined',
            districtId:''
           },
          { status: 400 }
        );
      }
      const user = rows.recordset[0];
      
      return NextResponse.json(
        { districtId: user.districtId },
        { status: 200 }
      );

    } catch (error:any) {
      return NextResponse.json(
        { message:error?.message,
             districtId:''
         },
        { status: 500 }
      );
    }
  }