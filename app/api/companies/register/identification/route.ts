import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import validator from "validator";
import { isValidateCompanyRegNumber } from "@/app/constants/sharedconstants";

export const POST = async (req: Request) => {
    let transaction: sql.Transaction | null = null;
    try {
        const { user_email, TradeName, regNo, TaxNo, VatNo } = await req.json();
        if (!isValidData(user_email, TradeName, regNo, TaxNo, VatNo)) {
            return NextResponse.json(
                { message: "Invalid form submitted" },
                { status: 400 }
            );
        }

        const pool = await connectToDatabase();
        transaction = pool.transaction();
        await transaction.begin();

        // 1. Check and create table if not exists
        await transaction.request().query(`
           IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CompaniesIdentification' AND xtype='U')
            BEGIN
                CREATE TABLE CompaniesIdentification (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    user_email VARCHAR(255) NOT NULL,
                    regNo VARCHAR(50) NOT NULL UNIQUE,
                    TradeName VARCHAR(255) NOT NULL UNIQUE,
                    TaxNo VARCHAR(100) NOT NULL UNIQUE,
                    VatNo VARCHAR(100) NOT NULL UNIQUE,
                    last_update DATETIME NOT NULL DEFAULT GETDATE()
                );
            END

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CompaniesAddress' AND xtype='U')
      BEGIN
        CREATE TABLE CompaniesAddress (
          id INT IDENTITY(1,1) PRIMARY KEY,
          physicalAddress VARCHAR(255),
          districtId VARCHAR(255),
          postal VARCHAR(255),
          holderEmail VARCHAR(255) NOT NULL,
          regNo VARCHAR(50) NOT NULL UNIQUE,
          proofAddress VARBINARY(MAX),
          proof_filename VARCHAR(255) NULL,
          last_update DATETIME NOT NULL DEFAULT GETDATE(),
          leased VARCHAR(20),
          leaseAgreement VARBINARY(MAX),
          lease_filename VARCHAR(255) NULL
        );
      END

      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CompaniesBanking' AND xtype='U')
      BEGIN
        CREATE TABLE CompaniesBanking (
          id INT IDENTITY(1,1) PRIMARY KEY,
          bankName VARCHAR(200) NOT NULL,
          accountNumber VARCHAR(20) NOT NULL,
          branchCode VARCHAR(10) NOT NULL,
          branchName VARCHAR(200) NOT NULL,
          holderEmail VARCHAR(255) NOT NULL,
          regNo VARCHAR(50) NOT NULL UNIQUE,
          accountType VARCHAR(50) NOT NULL,
          accountHolder VARCHAR(100) NOT NULL,
          proofBank VARBINARY(MAX) NULL,
          filename VARCHAR(255) NULL,
          last_update DATETIME NOT NULL DEFAULT GETDATE()
        );
      END
        `);

        // 2. Insert data
        const insertResult = await transaction.request()
            .input("user_email", sql.VarChar, user_email.trim())
            .input("regNo", sql.VarChar, regNo.trim())
            .input("TradeName", sql.VarChar, TradeName.trim())
            .input("TaxNo", sql.VarChar, TaxNo.trim())
            .input("VatNo", sql.VarChar, VatNo.trim())
            .query(`
                INSERT INTO CompaniesIdentification 
                (user_email, regNo, TradeName, TaxNo, VatNo) 
                OUTPUT inserted.* 
                VALUES (@user_email, @regNo, @TradeName, @TaxNo, @VatNo)
            `);

        const company = insertResult.recordset[0];
        if (!company) throw new Error("company insertion failed.");

        await transaction.request()
            .input("email", sql.VarChar, user_email.trim())
            .input("regNo",sql.VarChar,regNo.trim())
            .query(`INSERT INTO CompaniesAddress (holderEmail,regNo) VALUES (@email,@regNo)`);

        await transaction.request()
            .input("bankName", sql.VarChar, "Default Bank Name")
            .input("accountNumber", sql.VarChar, "0000000000")
            .input("branchCode", sql.VarChar, "00000")
            .input("branchName", sql.VarChar, "Branch Name")
            .input("holderEmail", sql.VarChar, user_email.trim())
            .input("regNo",sql.VarChar,regNo.trim())
            .input("accountType", sql.VarChar, "Account Type")
            .input("accountHolder", sql.VarChar, "")
            .query(`
                INSERT INTO CompaniesBanking (bankName, accountNumber, branchCode, branchName, holderEmail, regNo, accountType, accountHolder)
                VALUES (@bankName, @accountNumber, @branchCode, @branchName, @holderEmail,@regNo, @accountType, @accountHolder)
              `);
        await transaction.commit();

        return NextResponse.json(
            { message: "Company 's Personal (Identification) added successfully", company },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Transaction error:", error);
        if (transaction) await transaction.rollback();
        if (error.message.includes("Violation of UNIQUE KEY constraint") || error.message.includes("duplicate key")) {
            return NextResponse.json({ message: `Company with provided registration details already exist` }, { status: 409 });
        }
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};

const isValidData = (
    user_email: string,
    TradeName: string,
    regNo: string,
    TaxNo: string,
    VatNo: string
): boolean => {
    return (
        validator.isEmail(user_email?.trim()) &&
        isValidateCompanyRegNumber(regNo?.trim()) &&
        TradeName?.trim()?.length > 0 &&
        TaxNo?.trim()?.length > 0 &&
        validator.isNumeric(TaxNo?.trim()) &&
        validator.isNumeric(VatNo?.trim())
    );
};
