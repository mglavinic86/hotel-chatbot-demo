import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Villa Neretvanka — AI Concierge",
  description: "AI-powered hotel assistant demo by Sirius Grupa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className="bg-stone-50 min-h-screen">{children}</body>
    </html>
  );
}
