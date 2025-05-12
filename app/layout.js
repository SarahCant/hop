import "./globals.css";
import AuthProv from "./AuthProv";

/* browser title metadata */
export const metadata = {
  title: "SpilSammen Chat",
  description: "SpilSammen Chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body className="bg-[var(--bg)]">
        {/* AuthProv w/ AuthProvider */}
        <AuthProv>{children}</AuthProv>
      </body>
    </html>
  );
}
