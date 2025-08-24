'use client';

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/navebar/NaveBar";
import Footer from "./_components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className="antialiased bg-gray-50 flex flex-col min-h-screen font-sans"
      >
       <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </QueryClientProvider>
        </SessionProvider> 
      </body>
    </html>
  );
}