"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function RequireAuth({ children, delay = 700 }) {
  /* delay 0.7s  */
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    //redirect to login if loading or no currentUser
    if (!loading && !currentUser) {
      const t = setTimeout(() => {
        router.push("/login");
      }, delay);
      return () => clearTimeout(t);
    }
  }, [currentUser, loading, router, delay]);

  //if loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <div className="w-16 h-16 border-4 border-t-transparent border-[var(--green)] rounded-full animate-spin"></div>
      </div>
    );
  }

  //redirect
  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
