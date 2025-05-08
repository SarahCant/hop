"use client";

import "./globals.css";
import { AuthProvider } from "./context/auth";
import BottomMenu from "./bottommenu";

export default function RootLayout({ children }) {

  return (
    <html lang="da">
      <body className="bg-[var(--bg)]">
        <AuthProvider>
          {children}
          <BottomMenu />
        </AuthProvider>
      </body>
    </html>
  );
}