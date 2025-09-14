"use client"

import { Button, FooterDivider, Label, Spinner, TextInput } from "flowbite-react";
import Link from "next/link";
import { HiMail } from "react-icons/hi";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import { failureMessage } from "../notifications/successError";
import Image from "next/image";
import ledalogo from '../assets/images/logoleda.png';

const Login = () => {
    const [username, SetUserName] = useState("");
    const [password, setPassword] = useState("");
    const {handleLogin, loading}=useLogin();
    const router=useRouter();
    const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
        e?.preventDefault();
        if (!username.includes("@")) {
            failureMessage("Enter a valid email address.");
            return;
          }
        handleLogin(username,password).then(()=>{
            if (!sessionStorage.getItem('utoken') || sessionStorage.getItem('utoken') == null) return;
            SetUserName("");
            setPassword("");
            router.push('/dashboard');
        }).catch((error:any)=>{
            failureMessage(String(error.message));
        })
       
    }
    return ( 
        <div className="w-full h-full mt-2 pt-2 mb-1 flex items-center justify-center">
            <div>
                <form onSubmit={(e)=>handleSubmit(e)} className=" bg-slate-50 flex max-w-md flex-col gap-4 w-screen flex-grow border p-7 rounded-md shadow-md">
                <Image
                        width={65}
                        height={65}
                        src={ledalogo}
                        alt="leda logo"
                        />
                    <h2 className="text-lg dark:text-black">Log Into Your Account</h2>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" className="dark:text-black" >Your Email</Label>
                        </div>
                        <TextInput onChange={(e:any) => SetUserName(e.target.value)} value={username} color={"focuscolor"} icon={HiMail} id="email1" type="email" placeholder="name@mailprovider.co.za" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1" className="dark:text-black">
                            Your password</Label>
                        </div>
                        <TextInput onChange={(e:any) => setPassword(e.target.value)} value={password} color={"focuscolor"} id="password1" type="password" max={25} maxLength={25} required />
                    </div>
                    
                        <Button className="bg-[#92981B]" disabled={loading} type="submit" color="appsuccess">
                           {loading ? ( <Spinner size="sm" aria-label="Info spinner example" className="me-3" light />): null}
                            Log In</Button>
                    
                    <FooterDivider></FooterDivider>

                </form>
            </div>
        </div>
     );
}
 
export default Login;