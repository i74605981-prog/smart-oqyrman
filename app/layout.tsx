import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        {children}

        <Link
          href="/media"
          className="
            fixed bottom-5 right-4 z-[9999]
            flex items-center gap-2
            rounded-full
            bg-slate-900
            px-5 py-3
            text-sm font-bold
            text-white
            shadow-2xl
            md:hidden
          "
        >
          📸 Медиа
        </Link>
      </body>
    </html>
  );
}