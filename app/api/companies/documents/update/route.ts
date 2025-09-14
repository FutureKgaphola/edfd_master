import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import moment from "moment";

export const PATCH = async (req: Request) => {
    const tables = ["BusinessDocs", "ProcurementDocs", "BuildingDocs", "franchiseeDocs"];
    const formData = await req.formData();
    const regNo = formData.get('regNo') as string;
    const loanCat_id = formData.get('loanCat_id') as string;
    const filenames=formData.get('filenames') as string;
    const fileindex = formData.get('fileIndexes') as string;
    const id=formData.get('id') as string;
    const fileEntry = formData.get('file');

    let file;
    if (fileEntry && (fileEntry instanceof File)) {
        file = Buffer?.from(await fileEntry?.arrayBuffer());
    }

    // Connect to the database
    const pool = await connectToDatabase();
    let l_update = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
    if (!regNo || !loanCat_id) {
      return NextResponse.json({ message: "Missing required parameters." }, { status: 400 });
    }
        // update data into the database
        const result = await pool.request()
            .input("regNo", sql.VarChar, regNo?.trim())
            .input('file', sql.VarBinary, file)
            .input('last_update',sql.VarChar,l_update.trim())
            .input('filenames',sql.VarChar,filenames.trim())
            .input("fileIndexes", sql.VarChar, fileindex?.trim())
            .input("id", sql.Int, parseInt(id))
            .query(`UPDATE ${tables[parseInt(loanCat_id)]} SET filesData=@file , filenames=@filenames , last_update=@last_update  WHERE regNo = @regNo AND fileIndexes=@fileIndexes AND id=@id `);

        if (result.rowsAffected) {
            return NextResponse.json(
                { message: 'updated' },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: error?.message },
            { status: 500 }
        );
    } finally {
        pool.close();
    }
};