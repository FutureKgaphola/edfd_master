// app/api/audit/[applicationId]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const actionType = searchParams.get("actionType"); // e.g. UPDATE
    const startDate = searchParams.get("startDate"); // e.g. 2025-01-01
    const endDate = searchParams.get("endDate"); // e.g. 2025-12-31
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const applicationId = parseInt(searchParams.get("applicationId") || "0");

    const offset = (page - 1) * limit;

    const pool = await connectToDatabase();

    let query = `
      SELECT AuditID, ApplicationID, ActionType, OldValues, NewValues, ActionDate, ActionUser
      FROM Applications_Audit
      WHERE ApplicationID = @applicationId
    `;

    if (actionType) {
      query += ` AND ActionType = @actionType`;
    }
    if (startDate && endDate) {
      query += ` AND ActionDate BETWEEN @startDate AND @endDate`;
    }

    query += `
      ORDER BY ActionDate DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `;

    const result = await pool
      .request()
      .input("applicationId", sql.Int, applicationId)
      .input("actionType", sql.VarChar, actionType || null)
      .input("startDate", sql.DateTime, startDate ? new Date(startDate) : null)
      .input("endDate", sql.DateTime, endDate ? new Date(endDate) : null)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(query);

    return NextResponse.json({
      page,
      limit,
      total: result.recordset.length,
      data: result.recordset,
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch audit logs", error: error.message },
      { status: 500 }
    );
  }
};
