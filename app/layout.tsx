import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Dashboard",
  description: "Minimalist expense tracking dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950 text-slate-100">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
