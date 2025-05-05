"use client";

import "./globals.css";
import { AuthProvider } from "./context/auth";
import BottomMenu from "./bottommenu";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
    
          {children}
          <BottomMenu />
        </AuthProvider>
      </body>
    </html>
  );
}