import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/services/dbConfig";
import sql from "mssql";
import validator from "validator";
import { isValidateCompanyRegNumber } from "@/app/constants/sharedconstants";
import moment from 'moment';

// Type definitions for better type safety
interface ApplicationData {
    user_email: string;
    companyName: string;
    districtId: string;
    regNo: string;
    amount: string;
    loanDocs: string;
    leadContacts: any;
    leadAddress: any;
    leadBanking: any;
    companyDocs: any[];
    Companycontacts: any;
    Companyaddress: any;
    Companybanking: any;
    CompanyDirector: any[];
}

export const POST = async (req: Request) => {
    const timeRef = moment().format('hh:mm:ss');
    let transaction: sql.Transaction | null = null;
    let regCopy: string;

    try {
        const requestData: ApplicationData = await req.json();
        regCopy = requestData.regNo;

        //console.log(requestData.loanDocs);

        // Validate all data first before any DB operations
        if (!validateAllData(requestData)) {
            
            let errorMessage="";
            if(!isValidData(requestData.user_email, requestData.companyName, requestData.regNo, requestData.amount, requestData.districtId, requestData.loanDocs)){
                errorMessage='Invalid/insufficient data provided(company Name, amount, district, LoanType selected) from your account or browser. Make sure your account is complete & Refresh your browser and try again.';
            }else if(!isValidLeadContacts(requestData.leadContacts)){
                errorMessage='Invalid/insufficient lead contact Details provided';
            }
            else if(!isValidLeadAddress(requestData.leadAddress)){
                errorMessage='Invalid/insufficient lead Address Details provided';
            }
            else if(!isValidLeadBanking(requestData.leadBanking)){
                errorMessage='Invalid/insufficient lead Banking Details provided';
            }
            else if(!isValidCompanyDocs(requestData.companyDocs, requestData.loanDocs)){
                errorMessage='Invalid/insufficient company Documents Details provided';
            }
            else if(!isValidCompanyContacts(requestData.Companycontacts) ){
                errorMessage='Invalid/insufficient company contacts Details provided';
            }
            else if(!isValidCompanyAddress(requestData.Companyaddress)){
                errorMessage='Invalid/insufficient company address Details provided';
            }
            else if(!isValidCompanyBanking(requestData.Companybanking)){
                errorMessage='Invalid/insufficient company Banking Details provided';
            }
            else if(!isValidCompanyDirector(requestData.CompanyDirector)){
                errorMessage='Invalid/insufficient company Director(s) Details provided';
            }
            else{
                errorMessage="undefined error.";
            }
            return NextResponse.json(
                { message: errorMessage !== "undefined error." && !errorMessage.includes("Refresh your browser") ? errorMessage+". Correct this entries and try again." :  errorMessage },
                { status: 400 }
            );
        }

        const tableref = requestData.regNo.replace(/[^a-zA-Z0-9]/g, '');
        const applicationRef = `EDFD-${timeRef}-${tableref}`;

        const pool = await connectToDatabase();
        transaction = pool.transaction();
        await transaction.begin();

        try {
            // Create tables if they don't exist
            await createApplicationTables(transaction, tableref);

            // Insert application data
            await insertApplicationData(transaction, requestData, applicationRef);

            // Copy all related data to submitted tables
            await copyDataToSubmittedTables(transaction, requestData.regNo, requestData.user_email, applicationRef, tableref,requestData.loanDocs);

            await transaction.commit();

            return NextResponse.json(
                { message: "Application Submitted Successfully", applicationRef },
                { status: 201 }
            );
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }

    } catch (error: any) {
        console.error("Application submission error:", error);

        if (error.message.includes("Violation of UNIQUE KEY constraint") || error.message.includes("duplicate key")) {
            return NextResponse.json(
                { message: `An application already exists for this company registration: ${''}` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message: "Internal server error",
                details: "Something went wrong with your application. Please ensure your profile is complete before applying."
            },
            { status: 500 }
        );
    }
};

// Helper functions

async function createApplicationTables(transaction: sql.Transaction, tableref: string) {
    const tablesCreationQuery = `
        -- Applications table
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Applications' AND xtype='U')
        CREATE TABLE Applications (
            id INT IDENTITY(1,1) PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            regNo VARCHAR(255) NOT NULL,
            districtId VARCHAR(15) NOT NULL,
            status VARCHAR(255) NOT NULL,
            outcome VARCHAR(255) NOT NULL,
            stageAt VARCHAR(255) NOT NULL,
            message VARCHAR(255) NOT NULL,
            recommendation text NULL,
            empno VARCHAR(8) NOT NULL DEFAULT '00000000',
            managerId VARCHAR(11) NOT NULL DEFAULT '00000000',
            companyName VARCHAR(255) NOT NULL,
            amount VARCHAR(255) NOT NULL,
            loanDocs VARCHAR(255) NOT NULL,
            applicationRef VARCHAR(255) NOT NULL,
            create_date DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
        );

        -- SubmittedLeadPerson table
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedLeadPerson' AND xtype='U')
        CREATE TABLE SubmittedLeadPerson (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
            surname VARCHAR(15) NOT NULL,
            SaId VARCHAR(13) NOT NULL,
            Name VARCHAR(255) NOT NULL,
            IdCopy VARBINARY(MAX),
            maritalStatus VARCHAR(255) NOT NULL,
            statusProof VARBINARY(MAX),
            create_date DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedLeadSpounce' AND xtype='U')
            
                CREATE TABLE SubmittedLeadSpounce (
                id INT IDENTITY(1,1) PRIMARY KEY,
                applicationRef VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(255),
                SaId VARCHAR(13),
                Name VARCHAR(255),
                IdCopy VARBINARY(MAX),
                create_date DATETIME NOT NULL DEFAULT GETDATE(),
                last_update DATETIME NOT NULL DEFAULT GETDATE()
            );
            

                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedLeadAddress' AND xtype='U')
            
                CREATE TABLE SubmittedLeadAddress (
                id INT IDENTITY(1,1) PRIMARY KEY,
                applicationRef VARCHAR(255) NOT NULL,
                physical VARCHAR(255) NOT NULL,
                postal VARCHAR(255) NOT NULL,
                proofAddress VARBINARY(MAX) NOT NULL,
                create_date DATETIME NOT NULL DEFAULT GETDATE(),
                last_update DATETIME NOT NULL DEFAULT GETDATE()
                );
            

                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedLeadBanking' AND xtype='U')
            
                CREATE TABLE SubmittedLeadBanking (
                id INT IDENTITY(1,1) PRIMARY KEY,
                applicationRef VARCHAR(255) NOT NULL,
                Bank VARCHAR(255) NOT NULL,
                Branch VARCHAR(255) NOT NULL,
                AccountNumber VARCHAR(255) NOT NULL,
                BranchCode VARCHAR(255) NOT NULL,
                AccountHolderName VARCHAR(255) NOT NULL,
                TypeAccount VARCHAR(255) NOT NULL,
                proofAccount VARBINARY(MAX),
                create_date DATETIME NOT NULL DEFAULT GETDATE(),
                last_update DATETIME NOT NULL DEFAULT GETDATE()
                );
            

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedCompanyContacts' AND xtype='U')
            
                CREATE TABLE SubmittedCompanyContacts (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    user_email VARCHAR(255) NOT NULL,
                    applicationRef VARCHAR(255) NOT NULL,
                    regNo VARCHAR(50) NOT NULL,
                    TradeName VARCHAR(255) NOT NULL,
                    TaxNo VARCHAR(100) NOT NULL,
                    VatNo VARCHAR(100) NOT NULL,
                    create_date DATETIME NOT NULL DEFAULT GETDATE(),
                    last_update DATETIME NOT NULL DEFAULT GETDATE()
                );
            

                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedCompanyAddress' AND xtype='U')
            
                CREATE TABLE SubmittedCompanyAddress (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    applicationRef VARCHAR(255) NOT NULL,
                    physicalAddress VARCHAR(255),
                    districtId VARCHAR(255),
                    postal VARCHAR(255),
                    holderEmail VARCHAR(255) NOT NULL,
                    regNo VARCHAR(50) NOT NULL,
                    proofAddress VARBINARY(MAX),
                    proof_filename VARCHAR(255) NULL,
                    leased VARCHAR(20),
                    leaseAgreement VARBINARY(MAX),
                    lease_filename VARCHAR(255) NULL,
                    create_date DATETIME NOT NULL DEFAULT GETDATE(),
                    last_update DATETIME NOT NULL DEFAULT GETDATE()
                    );
                

                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedCompanyBanking' AND xtype='U')
            
                CREATE TABLE SubmittedCompanyBanking (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    applicationRef VARCHAR(255) NOT NULL,
                    bankName VARCHAR(200) NOT NULL,
                    accountNumber VARCHAR(20) NOT NULL,
                    branchCode VARCHAR(10) NOT NULL,
                    branchName VARCHAR(200) NOT NULL,
                    holderEmail VARCHAR(255) NOT NULL,
                    regNo VARCHAR(50) NOT NULL,
                    accountType VARCHAR(50) NOT NULL,
                    accountHolder VARCHAR(100) NOT NULL,
                    proofBank VARBINARY(MAX) NULL,
                    filename VARCHAR(255) NULL,
                    create_date DATETIME NOT NULL DEFAULT GETDATE(),
                    last_update DATETIME NOT NULL DEFAULT GETDATE()
                    );
                
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedBusinessDocs' AND xtype='U')
      
            CREATE TABLE SubmittedBusinessDocs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            filenames VARCHAR(255),
            fileIndexes VARCHAR(255),
            loanCat_id VARCHAR(255),
            regNo VARCHAR(255),
            filesData VARBINARY(MAX),
            createdAt DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
            );
            

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedProcurementDocs' AND xtype='U')
            
            CREATE TABLE SubmittedProcurementDocs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            filenames VARCHAR(255),
            fileIndexes VARCHAR(255),
            loanCat_id VARCHAR(255),
            regNo VARCHAR(255),
            filesData VARBINARY(MAX),
            createdAt DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
            );
            

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedBuildingDocs' AND xtype='U')
            
            CREATE TABLE SubmittedBuildingDocs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            filenames VARCHAR(255),
            fileIndexes VARCHAR(255),
            loanCat_id VARCHAR(255),
            regNo VARCHAR(255),
            filesData VARBINARY(MAX),
            createdAt DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
            );
            

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedfranchiseeDocs' AND xtype='U')
            
            CREATE TABLE SubmittedfranchiseeDocs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            filenames VARCHAR(255),
            fileIndexes VARCHAR(255),
            loanCat_id VARCHAR(255),
            regNo VARCHAR(255),
            filesData VARBINARY(MAX),
            createdAt DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
            );
            

        
        
        -- SubmittedDirectors table (dynamic name)
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SubmittedDirectors${tableref}' AND xtype='U')
        CREATE TABLE SubmittedDirectors${tableref} (
            id INT IDENTITY(1,1) PRIMARY KEY,
            applicationRef VARCHAR(255) NOT NULL,
            fullnames VARCHAR(255) NOT NULL,
            regNo VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            percentage VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
            proof_Resfilename VARCHAR(255) NOT NULL,
            copy_safilename VARCHAR(255) NOT NULL,
            proof_Res_Indexes VARCHAR(255) NOT NULL,
            copy_sa_Indexes VARCHAR(255) NOT NULL,
            proofRes VARBINARY(MAX) NOT NULL,
            copy_sa_id VARBINARY(MAX) NOT NULL,
            create_date DATETIME NOT NULL DEFAULT GETDATE(),
            last_update DATETIME NOT NULL DEFAULT GETDATE()
        );
    `;

    await transaction.request().query(tablesCreationQuery);
}

async function insertApplicationData(transaction: sql.Transaction, data: ApplicationData, applicationRef: string) {
    const insertQuery = `
        INSERT INTO Applications (
            user_email, companyName, regNo, districtId, status, outcome, 
            stageAt, message,recommendation, amount, loanDocs, applicationRef
        )
        VALUES (
            @user_email, @companyName, @regNo, @districtId, 'open', 
            '', '1', 'Basic Assessment and Due Deligence.', '',
            @amount, @loanDocs, @applicationRef
        );
    `;

    const request = transaction.request();
    request.input("user_email", sql.VarChar, data.user_email);
    request.input("companyName", sql.VarChar, data.companyName);
    request.input("regNo", sql.VarChar, data.regNo);
    request.input("districtId", sql.VarChar, data.districtId);
    request.input("amount", sql.VarChar, data.amount);
    request.input("loanDocs", sql.VarChar, data.loanDocs);
    request.input("applicationRef", sql.VarChar, applicationRef);

    await request.query(insertQuery);
}

async function copyDataToSubmittedTables(
  transaction: sql.Transaction,
  regNo: string,
  user_email: string,
  applicationRef: string,
  tableref: string,
  loanDocs: string // add this param from requestData.loanDocs
) {
  let conditionalDocInsert = "";

  if (loanDocs === "Business") {
    conditionalDocInsert = `
      INSERT INTO SubmittedBusinessDocs (
        applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      )
      SELECT 
        @applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      FROM BusinessDocs
      WHERE regNo = @regNo;
    `;
  } else if (loanDocs === "Procurement") {
    conditionalDocInsert = `
      INSERT INTO SubmittedProcurementDocs (
        applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      )
      SELECT 
        @applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      FROM ProcurementDocs
      WHERE regNo = @regNo;
    `;
  } else if (loanDocs === "Building") {
    conditionalDocInsert = `
      INSERT INTO SubmittedBuildingDocs (
        applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      )
      SELECT 
        @applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      FROM BuildingDocs
      WHERE regNo = @regNo;
    `;
  } else if (loanDocs === "Franchisee") {
    conditionalDocInsert = `
      INSERT INTO SubmittedfranchiseeDocs (
        applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      )
      SELECT 
        @applicationRef, filenames, fileIndexes, loanCat_id, regNo, filesData
      FROM franchiseeDocs
      WHERE regNo = @regNo;
    `;
  }

  const copyQuery = `
    -- Lead Person
    INSERT INTO SubmittedLeadPerson (
        applicationRef, email, phone, surname, SaId, Name, IdCopy, maritalStatus, statusProof
    )
    SELECT 
        @applicationRef, user_email, phone, last_name, holdersaId, first_name, holderIDcopy,
        marital_status, maritalDocument
    FROM LeadContact
    WHERE user_email = @user_email;

    -- Lead Spouse
    INSERT INTO SubmittedLeadSpounce (
        applicationRef, email, phone, SaId, Name, IdCopy
    )
    SELECT 
        @applicationRef, SpouceEmail, SpoucePhone, SpouceId, SpouceName, SpouceIDcopy
    FROM LeadContact
    WHERE user_email = @user_email;

    -- SubmittedLeadAddress
    INSERT INTO SubmittedLeadAddress (
      applicationRef, physical, postal, proofAddress
    )
    SELECT 
      @applicationRef, physicalAddress, postal, proofAddress
    FROM LeadAddress
    WHERE holderEmail = @user_email;

    -- SubmittedLeadBanking
    INSERT INTO SubmittedLeadBanking (
      applicationRef, Bank, Branch, AccountNumber, BranchCode, AccountHolderName, TypeAccount, proofAccount
    )
    SELECT 
      @applicationRef, bankName, branchName, accountNumber, branchCode, accountHolder, accountType, proofBank
    FROM LeadBanking
    WHERE holderEmail = @user_email;

    -- SubmittedCompanyContacts
    INSERT INTO SubmittedCompanyContacts (
      applicationRef, user_email, regNo, TradeName, TaxNo, VatNo
    )
    SELECT 
      @applicationRef, user_email, regNo, TradeName, TaxNo, VatNo
    FROM CompaniesIdentification
    WHERE regNo = @regNo;

    -- SubmittedCompanyAddress
    INSERT INTO SubmittedCompanyAddress (
      applicationRef, physicalAddress, districtId, postal, holderEmail, regNo, proofAddress,
      proof_filename, leased, leaseAgreement, lease_filename
    )
    SELECT 
      @applicationRef, physicalAddress, districtId, postal, holderEmail, regNo, proofAddress,
      proof_filename, leased, leaseAgreement, lease_filename
    FROM CompaniesAddress
    WHERE regNo = @regNo;

    -- SubmittedCompanyBanking
    INSERT INTO SubmittedCompanyBanking (
      applicationRef, bankName, accountNumber, branchCode, branchName, holderEmail, regNo, accountType,
      accountHolder, proofBank, filename
    )
    SELECT 
      @applicationRef, bankName, accountNumber, branchCode, branchName, holderEmail, regNo, accountType,
      accountHolder, proofBank, filename
    FROM CompaniesBanking
    WHERE regNo = @regNo;

    ${conditionalDocInsert}  -- This line inserts only the matched document type

    -- Directors
    INSERT INTO SubmittedDirectors${tableref} (
        applicationRef, fullnames, regNo, email, percentage, phone, proof_Resfilename, copy_safilename,
        proof_Res_Indexes, copy_sa_Indexes, proofRes, copy_sa_id
    )
    SELECT 
        @applicationRef, fullnames, regNo, email, percentage, phone, proof_Resfilename, copy_safilename,
        proof_Res_Indexes, copy_sa_Indexes, proofRes, copy_sa_id
    FROM Directors${tableref}
    WHERE regNo = @regNo;
  `;

  const request = transaction.request();
  request.input("applicationRef", sql.VarChar, applicationRef);
  request.input("user_email", sql.VarChar, user_email);
  request.input("regNo", sql.VarChar, regNo);

  await request.query(copyQuery);
}


function validateAllData(data: ApplicationData): boolean {
    
    return (
        isValidData(data.user_email, data.companyName, data.regNo, data.amount, data.districtId, data.loanDocs) &&
        isValidLeadContacts(data.leadContacts) &&
        isValidLeadAddress(data.leadAddress) &&
        isValidLeadBanking(data.leadBanking) &&
        isValidCompanyDocs(data.companyDocs, data.loanDocs) &&
        isValidCompanyContacts(data.Companycontacts) &&
        isValidCompanyAddress(data.Companyaddress) &&
        isValidCompanyBanking(data.Companybanking) &&
        isValidCompanyDirector(data.CompanyDirector)
    );
}

// [Rest of your validation functions...]


const isValidLeadContacts = (leadContacts: any) => {

    if (!leadContacts) return false;
    if (leadContacts.marital_status == 'Single' &&
        leadContacts.maritalDocument !== null &&
        leadContacts.maritalDocfilename !== null && leadContacts.holderIDcopy !== null
        && leadContacts.holderIDfilename !== null &&
        leadContacts.user_email !== null && leadContacts.first_name !== null && leadContacts.last_name !== null
        && leadContacts.phone !== null
        && leadContacts.holdersaId !== null) {
        leadContacts.SpouceName = null;
        leadContacts.SpouceId = null;
        leadContacts.SpoucePhone = null;
        leadContacts.SpouceEmail = null;
        leadContacts.SpouceIDcopy = null;
        leadContacts.SpouceIDfilename = null;
        return true;
    }

    else if (leadContacts.marital_status == 'Married' &&
        leadContacts.maritalDocument !== null &&
        leadContacts.maritalDocfilename !== null && leadContacts.SpouceName !== null
        && leadContacts.SpouceId !== null && leadContacts.SpoucePhone !== null &&
        leadContacts.SpouceEmail !== null && leadContacts.SpouceIDcopy !== null
        && leadContacts.SpouceIDfilename !== null && leadContacts.holderIDcopy !== null
        && leadContacts.holderIDfilename !== null &&
        leadContacts.user_email !== null && leadContacts.first_name !== null && leadContacts.last_name !== null
        && leadContacts.phone !== null
        && leadContacts.holdersaId !== null) {
        return true;
    }

    else if (leadContacts.marital_status == 'Divorced' &&
        leadContacts.maritalDocument !== null &&
        leadContacts.maritalDocfilename !== null && leadContacts.holderIDcopy !== null
        && leadContacts.holderIDfilename !== null &&
        leadContacts.user_email !== null && leadContacts.first_name !== null && leadContacts.last_name !== null
        && leadContacts.phone !== null
        && leadContacts.holdersaId !== null) {
        leadContacts.SpouceName = null;
        leadContacts.SpouceId = null;
        leadContacts.SpoucePhone = null;
        leadContacts.SpouceEmail = null;
        leadContacts.SpouceIDcopy = null;
        leadContacts.SpouceIDfilename = null;
        return true;
    } else {
        return false;
    }
}

const isValidCompanyContacts = (companyContacts: any): boolean => {
    if (!companyContacts) return false;
    // Iterate through each property of the object
    for (const key in companyContacts) {
        if (companyContacts[key] === null || companyContacts[key] === undefined) {
            return false; // If any property is null or undefined, return false
        }
    }
    return true; // All properties are valid
}

const isValidCompanyAddress = (companyAddress: any): boolean => {
    if (!companyAddress) return false;
    console.log(companyAddress);
    // Iterate through each property of the object
    if (companyAddress.leased == "Leased") {
        for (const key in companyAddress) {
            if (companyAddress[key] === null || companyAddress[key] === undefined) {
                return false; // If any property is null or undefined, return false
            }
        }

        return true; // All properties are valid
    } else if (companyAddress.leased == "Own" && companyAddress.physicalAddress !== null && companyAddress.postal !== null
            && companyAddress.proofAddress !== null && companyAddress.proof_filename !== null
            && companyAddress.districtId !== null
            && companyAddress.holderEmail !== null && companyAddress.regNo !== null) {
        return true;

    } else {
        return false; // properties are invalid
    }


}

const isValidCompanyBanking = (companyBanking: any): boolean => {
    if (!companyBanking) return false;
    // Iterate through each property of the object
    for (const key in companyBanking) {
        if (companyBanking[key] === null || companyBanking[key] === undefined) {
            return false; // If any property is null or undefined, return false
        }
    }
    return true; // All properties are valid
}
const isValidCompanyDirector = (companyDirector: any): boolean => {
    if (!companyDirector) return false;
    if (companyDirector.length < 1) return false; // At least one director is required
    return true;

}

const isValidLeadAddress = (leadAddress: any): boolean => {
    if (!leadAddress) return false;

    // Iterate through each property of the object
    for (const key in leadAddress) {
        if (leadAddress[key] === null || leadAddress[key] === undefined) {
            return false; // If any property is null or undefined, return false
        }
    }

    return true; // All properties are valid
};

const isValidLeadBanking = (leadBanking: any): boolean => {
    if (!leadBanking) return false;
    // Iterate through each property of the object
    for (const key in leadBanking) {
        if (leadBanking[key] === null || leadBanking[key] === undefined) {
            return false; // If any property is null or undefined, return false
        }
    }
    return true; // All properties are valid
}

const isValidCompanyDocs = (companyDocs: any[], loanDocs: string): boolean => {
    if (!companyDocs) return false;
    if (loanDocs?.trim() == "Business" && companyDocs.length == 8) {
        return true; // All properties are valid
    }
    else if (loanDocs?.trim() == "Procurement" && companyDocs.length == 9) {

        return true; // All properties are valid
    }else if (loanDocs?.trim() == "Building" && companyDocs.length == 9) {
        return true; // All properties are valid
    }
    else if (loanDocs?.trim() == "Franchisee" && companyDocs.length == 8) {
        return true; // All properties are valid
    }else {
        return false; // All properties are valid
    }
}



const isValidData = (
    user_email: string,
    companyName: string,
    regNo: string,
    amount: string,
    districtId: string,
    loanDocs: string
): boolean => {

    return (
        validator.isEmail(user_email?.trim()) &&
        isValidateCompanyRegNumber(regNo?.trim()) &&
        loanDocs?.trim()?.length > 0 &&
        companyName?.trim()?.length > 0 &&
        validator.isNumeric(districtId?.trim()) &&
        validator.isNumeric(amount?.trim())
    );
};