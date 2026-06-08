import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyLend | Community Lending",
  description: "Decentralized lending pool with social credit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen`}>
        <nav className="border-b border-slate-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              EasyLend
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-blue-400 transition-colors">Dashboard</Link>
              <Link href="/lend" className="hover:text-blue-400 transition-colors">Lend</Link>
              <Link href="/borrow" className="hover:text-blue-400 transition-colors">Borrow</Link>
              <Link href="/loans" className="hover:text-blue-400 transition-colors">Loans</Link>
              <Link href="/vouch" className="hover:text-blue-400 transition-colors">Vouch</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
