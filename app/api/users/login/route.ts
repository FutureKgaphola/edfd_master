import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import bcrypt from "bcrypt";
import validator from "validator";
import { CreateToken } from "@/lib/TokenGenerator/getToken";

export const POST=async(req:Request)=>{
    const pool = await connectToDatabase();
    try {
      const { email, password } = await req.json();
      if(!validator.isEmail(email)){
        return NextResponse.json(
          { message: 'Could not verify provided email format' },
          { status: 400 }
        );
      }
      // Query the database for the user by email
      const rows = await pool.request()
        .input("email", sql.VarChar, email.trim())
        .query('SELECT TOP 1 * FROM superAdmin WHERE user_email = @email');
      
      // Check if the user was found
      if (rows.recordset.length === 0) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 400 }
        );
      }
      const user = rows.recordset[0];
      // Compare the password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 400 }
        );
      }

      const { password: _, FileData: __, ...userWithoutPassword } = user;

      
      if(userWithoutPassword.verify_tk!=="verified"){
        return NextResponse.json(
          { message: 'Please verify your email address. check you mail box for verification link' },
          { status: 400 }
        );
      }

      if(user.active!==parseInt("1")){
        return NextResponse.json(
          { message: 'Unathorized account access not granted' },
          { status: 400 }
        );
      }

      
      const token = CreateToken(user.user_email);
      return NextResponse.json(
        { message: 'Login successful', user: userWithoutPassword,token },
        { status: 200 }
      );

    } catch (error:any) {
      console.log(error?.message);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }