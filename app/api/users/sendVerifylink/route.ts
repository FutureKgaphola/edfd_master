import { mailClientVeficationToken } from "@/app/services/mailVerification"
import { NextResponse } from "next/server";

export const POST=async(req:Request)=>{
    const result=await req.json();
    const {email,name,token}=result;
    //console.log("Received data:", { email, name, token });
    let resp=await mailClientVeficationToken({email,name,token});
    if(resp=="message sent"){
        return NextResponse.json(
            { message: resp },
            { status: 200 }
          );
    }else{
        return NextResponse.json(
            { message: resp },
            { status: 500 }
          );
    }
  
}