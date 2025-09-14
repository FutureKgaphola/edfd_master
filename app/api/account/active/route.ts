import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const PUT = async (req: Request) => {
  try {
    const { id, table, action } = await req.json();

    // Validate input
    if (!id || !table) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const AllowedTables = ["LeadContact", "Managers", "Originators"];
    if (!AllowedTables.includes(table)) {
        console.log(table);
      return NextResponse.json({ message: "Invalid table" }, { status: 400 });
    }

    const parsedAction = parseInt(action.toString().trim(), 10);
    if (!Number.isInteger(parsedAction) || (parsedAction !== 0 && parsedAction !== 1)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const pool = await connectToDatabase();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("active", sql.Int, parsedAction)
      .query(`
        UPDATE ${table}
        SET active = @active
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: parsedAction === 1 ? "Account activated successfully" : "Account deactivated successfully" }, { status: 200 });

  } catch (error: any) {
    if (
      error.message.includes("Violation of UNIQUE KEY constraint") ||
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json({ message: "Account name already exists" }, { status: 409 });
    }

    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
