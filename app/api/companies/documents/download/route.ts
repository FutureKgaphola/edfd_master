import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const pool = await connectToDatabase();
    const tables = ["BusinessDocs", "ProcurementDocs", "BuildingDocs", "franchiseeDocs"];
    try {
        const url = new URL(req.url);
        const regNo = url.searchParams.get('regNo');
        const loanCat_id = url.searchParams.get('loanCat_id');
        const id=url.searchParams.get('id');

        if (!regNo || !loanCat_id || !id) {
            return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
        }
        // Ensure the id is a valid integer
        const parsedId = parseInt(loanCat_id);
        if (isNaN(parsedId)) {
            return NextResponse.json({ message: "Invalid loan ID parameter." }, { status: 400 });
        }

        const result = await pool.request()
            .input("regNo", sql.VarChar, regNo?.trim())
            .input("id", sql.Int, parseInt(id?.trim()))
            .query(`SELECT filesData FROM ${tables[parseInt(loanCat_id)]} WHERE regNo = @regNo AND id=@id`);

        if (result.recordset.length > 0) {
            const fileData = result.recordset[0].filesData;
            const fileName = result.recordset[0].filenames || "downloadedFile";
            const buffer = Buffer.from(fileData, 'base64');

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${fileName}"`
                }
            });
        } else {
            return NextResponse.json({ message: "File not found" }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Error fetching file:", error);
        return NextResponse.json({ message: error?.message || "Internal Server Error" }, { status: 500 });
    } finally {
        pool.close();
    }
};
