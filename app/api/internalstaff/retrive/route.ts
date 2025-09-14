import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";

export const GET = async (req: Request) => {
  const pool = await connectToDatabase();
  try {
    const rows = await pool.request().query(`
            SELECT 
                id,
                fullnames AS full_name,
                empno,
                email,
                districtId,
                NULL AS phone,
                NULL AS verify_tk,
                create_date,
                last_update,
                active,
                'Originators' AS source
            FROM Originators

            UNION ALL

            SELECT
                id,
                CONCAT(first_name, ' ', last_name) AS full_name,
                empno,
                user_email AS email,
                districtId,
                phone,
                verify_tk,
                create_date,
                last_update,
                active,
                'Managers' AS source
            FROM Managers;
`);

    if (rows.recordset.length === 0) {
      return NextResponse.json(
        { message: "Internal Staff(s) not found" },
        { status: 400 }
      );
    }
    const staff = rows.recordset;
    return NextResponse.json({ staff: staff }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message }, { status: 500 });
  }
};
