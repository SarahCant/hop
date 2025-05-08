"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function RequireAuth({ children, delay = 700 }) { /* delay 0.7s  */
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      const t = setTimeout(() => {
        router.push("/login");
      }, delay);
      return () => clearTimeout(t);
    }
  }, [currentUser, loading, router, delay]);

  // 1) still initializing? show a loader
  if (loading) {
    return <div>Loading…</div>;
  }

  // 2) no user? (we’re already redirecting above)
  if (!currentUser) {
    return null;
  }

  // 3) safe to render children
  return <>{children}</>;
}
