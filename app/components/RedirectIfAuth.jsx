/* "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RedirectIfAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // Redirect if user is logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return children;
}
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RedirectIfAuth({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--cta)]/45">
        <div className="w-16 h-16 border-4 border-t-transparent border-[var(--green)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
