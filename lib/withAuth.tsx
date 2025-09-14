import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import React from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.AuthReducer.token);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    useEffect(() => {
      if (isHydrated && !token) {
        //console.log("Redirecting to login...");
        router.replace("/");
      }
    }, [isHydrated, token, router]);

    if (!isHydrated) return null; // prevent hydration mismatch
    if (!token) return null;

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}
