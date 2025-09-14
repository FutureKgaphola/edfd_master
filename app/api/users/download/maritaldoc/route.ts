import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const pool = await connectToDatabase();

    try {
        const url = new URL(req.url);
        const id: string = url.searchParams.get("id")?.trim() || "";
        const user_email: string = url.searchParams.get("m")?.trim() || "";
       
        // Validate the input parameters
        if (!id || !user_email) {
            return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
        }

        // Ensure the id is a valid integer
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return NextResponse.json({ message: "Invalid ID parameter." }, { status: 400 });
        }

        const result = await pool.request()
            .input("user_email", sql.VarChar, user_email)
            .input('id', sql.Int, parsedId)
            .query(`SELECT TOP 1 maritalDocument, maritalDocfilename FROM LeadContact WHERE id = @id AND user_email = @user_email`);

        if (result.recordset.length > 0) {
            const fileData = result.recordset[0].maritalDocument;
            const fileName = result.recordset[0].maritalDocfilename  || "downloaded_file"; // Use the provided filename or a default one
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
