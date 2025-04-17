import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { PatientProvider } from "@/app/_contexts/PatientContext";
import { AuthProvider } from "@/app/_providers/AuthProvider";
import { ReactQueryProvider } from "@/app/_providers/ReactQueryProvider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patient Management System",
  description:
    "Integrated platform for patient and medical appointment management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <PatientProvider>
                <div className="font-inter min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-slate-900 relative">
                  {/* Sidebar */}
                  <Sidebar />

                  {/* Main content container - adjust margin for sidebar */}
                  <div className="flex flex-col flex-1 transition-all duration-300">
                    {/* Header */}
                    <Header />

                    {/* Main content */}
                    <main className="flex-1 md:p-6 lg:p-8">
                      <div className="lg:pt-4 pt-16">{children}</div>
                    </main>

                    {/* Footer */}
                    <Footer />
                  </div>
                </div>
              </PatientProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
