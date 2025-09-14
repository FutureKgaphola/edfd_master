import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import validator from "validator";

export const POST = async (req: Request) => {
    const pool = await connectToDatabase();
    try {
        const { email } = await req.json();
        if (!validator.isEmail(email)) {
            return NextResponse.json(
                { message: 'Could not verify provided email format', exists: false },
                { status: 400 }
            );
        }
        // Query the database for the user by email
        const rows = await pool.request()
            .input("email", sql.VarChar, email.trim())
            .query('SELECT user_email FROM Managers WHERE user_email = @email');

        // Check if the user was found
        if (rows.recordset.length === 0) {
            return NextResponse.json(
                { message: 'Email Not Registered', exists: false },
                { status: 400 }
            );
        }
        const user = rows.recordset[0];
        if (user) {
            return NextResponse.json(
                { message: 'User found', exists: true },
                { status: 200 }
            );
        }

    } catch (error: any) {
        console.log(error?.message);
        return NextResponse.json(
            { message: "Internal server error", exists: false },
            { status: 500 }
        );
    }
}