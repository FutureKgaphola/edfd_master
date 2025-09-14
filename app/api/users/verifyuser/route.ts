import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import { VerifyToken } from "@/lib/TokenGenerator/VerifyToken";
import moment from 'moment';

export const GET = async (req: Request) => {
  const pool = await connectToDatabase();
  try {
    const url = new URL(req.url);
    const tmpTk: string = url.searchParams.get("tk")?.trim() || "";
    // Validate token
    const { valid } = VerifyToken(tmpTk);

    if (valid) {
      let v_update =moment().format("YYYY-MM-DD HH:mm:ss");
      const rows = await pool.request()
        .input("verify_tk", sql.VarChar, tmpTk)
        .input("verified", sql.VarChar, "verified")
        .query(`
          UPDATE LeadContact
          SET verify_tk = @verified 
          OUTPUT inserted.verify_tk
          WHERE verify_tk = @verify_tk
        `);

      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: "Failed to verify or token has already been used" },
          { status: 400 }
        );
      }

      // Redirect to login screen if successful
      return NextResponse.redirect(process?.env.DOMAIN || "https://www.google.com/");
    } else {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error verifying token:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
};
