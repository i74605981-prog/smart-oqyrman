import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMART OQYRMAN",
  description:
    "SMART OQYRMAN — оқушылардың көркем әдебиет оқуға қызығушылығын арттыруға арналған цифрлық оқу платформасы.",
};

export const viewport: Viewport = {
  width: 1280,
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