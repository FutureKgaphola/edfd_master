import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";

export const GET = async (req: Request) => {
    const pool = await connectToDatabase();

    try {
        const rows = await pool.request()
            
            .query('SELECT * FROM Applications');

        if (rows.recordset.length === 0) {
            return NextResponse.json(
                {
                    Applications: [],
                    message: 'No applications found'
                },
                { status: 404 }
            );
        }

        const Applications = await Promise.all(
            rows.recordset.map(async (item) => {
                try {
                    const drows = await pool.request()
                        .input('id', sql.Int, parseInt(item.districtId?.trim()))
                        .query('SELECT districtName FROM Districts WHERE id = @id');

                    const districtName = drows.recordset[0]?.districtName || null;
                    return {
                        ...item,
                        districtName
                    };
                } catch (err) {
                    return {
                        ...item,
                        districtName: null
                    };
                }
            })
        );

        return NextResponse.json({ Applications,
            Capricorn: Applications?.filter(item => item.districtName.trim().toLowerCase() == 'capricorn'),
            Mopani: Applications?.filter(item => item.districtName.trim().toLowerCase() == 'mopani'),
            Sekhukhune: Applications?.filter(item => item.districtName.trim().toLowerCase() == 'sekhukhune'),
            Vhembe: Applications?.filter(item => item.districtName.trim().toLowerCase() == 'vhembe'),
            Waterberg: Applications?.filter(item => item.districtName.trim().toLowerCase() == 'waterberg')
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
};
