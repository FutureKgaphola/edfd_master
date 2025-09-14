import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";

export const GET = async (req: Request) => {
    const pool = await connectToDatabase();
    try {
        const rows = await pool.request().query(`
        SELECT 
            id,
            user_email,
            first_name,
            last_name,
            phone,
            active,
            holdersaId,
            verify_tk,
            create_date,
            last_update,
            marital_status,
            SpouceName,
            SpouceId,
            SpoucePhone,
            SpouceEmail
            FROM LeadContact;
`);

        if (rows.recordset.length === 0) {
            return NextResponse.json(
                { message: "Clients not found" },
                { status: 400 }
            );
        }
        const clients = rows.recordset;
        return NextResponse.json({ clients: clients }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error?.message }, { status: 500 });
    }
};
