import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const pool = await connectToDatabase();

    try {
        const url = new URL(req.url);
        const id: string = url.searchParams.get("id")?.trim() || "";
        const user_email: string = url.searchParams.get("email")?.trim() || "";
        const regNo: string = url.searchParams.get("regNo")?.trim() || "";
        const index: string = url.searchParams.get("index")?.trim() || "";
       

        const cols = index == '0' ? 'proofRes, proof_Resfilename' : index == '1' ? 'copy_sa_id, copy_safilename' : null;
        const table = 'Directors' + regNo.replace(/[^a-zA-Z0-9]/g, '');
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
            .input("holderEmail", sql.VarChar, user_email)
            .input('id', sql.Int, parsedId)
            .query(`SELECT TOP 1 ${cols}  FROM ${table} WHERE id = @id AND email = @holderEmail`);

        if (result.recordset.length > 0) {
            let fileData,fileName;
            if (index == '0') {
                 fileData = result.recordset[0].proofRes;
                 fileName = result.recordset[0].proof_Resfilename || "downloaded_file"; // Use the provided filename or a default one
            } else {
                 fileData = result.recordset[0].copy_sa_id;
                 fileName = result.recordset[0].copy_safilename || "downloaded_file"; // Use the provided filename or a default one
            }
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
