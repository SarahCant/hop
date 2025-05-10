"use client";

import "./globals.css";
import { AuthProvider } from "./context/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body className="bg-[var(--bg)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
