import { connectToDatabase } from "@/app/services/dbConfig";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
    const tables = ["BusinessDocs", "ProcurementDocs", "BuildingDocs", "franchiseeDocs"];
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const regNo = url.searchParams.get('regNo');
    const loanCat_id = url.searchParams.get('loanCat_id');
    const fileIndex = url.searchParams.get('fileIndexes');
    try {
        if (!loanCat_id || !regNo || !id || parseInt(loanCat_id) < 0 || parseInt(loanCat_id) >= tables.length) {
            return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
        }

        const tableName = tables[parseInt(loanCat_id)];
        const pool = await connectToDatabase();
        const query = `DELETE FROM ${tableName} WHERE id = @id AND regNo = @regNo AND fileIndexes=@fileIndexes`;
        const result = await pool.request()
            .input("id", id)
            .input("regNo", regNo)
            .input("fileIndexes", fileIndex)
            .query(query);

        if (result.rowsAffected[0] > 0) {
            return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "No matching record found" }, { status: 404 });
        }
    } catch (error: any) {
        console.error("Error deleting record:", error);
        if (error.code === "EREQUEST") {
            return NextResponse.json({ message: "Database request error" }, { status: 400 });
        }
        console.error("Error deleting record:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};