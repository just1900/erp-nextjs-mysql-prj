import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LayoutContent } from "@/components/layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern ERP System",
  description: "Comprehensive ERP solutions with Next.js and TiDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
