import Footer from "@/app/_components/Footer";
import { PatientProvider } from "@/app/_contexts/PatientContext";
import { AuthProvider } from "@/app/_providers/AuthProvider";
import { ReactQueryProvider } from "@/app/_providers/ReactQueryProvider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LayoutClientWrapper from "./_components/LayoutClientWrapper";

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
                <LayoutClientWrapper>{children}</LayoutClientWrapper>
                <Footer />
              </PatientProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
