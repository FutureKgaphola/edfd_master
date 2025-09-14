"use client"
import { useRouter } from "next/navigation";
import Login from "./components/login";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect } from "react";

const Home= ()=> {
  const router = useRouter();
    const token = useSelector((state: RootState) => state.AuthReducer.token);
    useEffect(() => {
      if (token) {
        router.replace("/dashboard");
      }
    }, [token]);
  return (
    <div
      style={{
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage:
          "url('tree.jpg')",
      }}
      className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Login />

      </main>

    </div>
  );
}
export default Home;
