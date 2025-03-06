// app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Cairo, Inter } from "next/font/google";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نظام إدارة المرضى",
  description: "منصة متكاملة لإدارة المرضى والمواعيد الطبية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div
            className="font-cairo min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-slate-900 relative"
            dir="rtl"
          >
            {/* Sidebar */}
            <Sidebar />

            {/* Main content container - adjust margin for sidebar */}
            <div className="flex flex-col flex-1 lg:mr-[70px] transition-all duration-300">
              {/* Header */}
              <Header />

              {/* Main content */}
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="lg:pt-4 pt-16">{children}</div>
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
