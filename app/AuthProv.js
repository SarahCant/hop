"use client";
import { AuthProvider } from "./context/auth";

export default function AuthProv({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
