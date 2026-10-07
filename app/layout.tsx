import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMART OQYRMAN",
  description: "Оқушыларға арналған цифрлық оқу платформасы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}