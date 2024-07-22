import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./NextAuthProvider";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import AppInitializer from "@/components/AppInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SplitEase",
  description: "The Expense Sharing App.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <AppInitializer>
              <Navbar />
              {children}
              <Toaster />
            </AppInitializer>
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}
