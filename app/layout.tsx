import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrodel - Produtos Agrícolas",
  description: "Plataforma de produtos agrícolas de qualidade para o seu negócio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navbar />
        <main>
          {children}
        </main>
        <footer className="bg-green-800 text-white py-8 mt-10">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Agrodel - Todos os direitos reservados</p>
          </div>
        </footer>
      </body>
    </html>
  );
}