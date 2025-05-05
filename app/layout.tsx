import Footer from "@/app/_components/Footer";
import LayoutClientWrapper from "@/app/_components/LayoutClientWrapper";
import { LanguageProvider } from "@/app/_contexts/LanguageContext";
import { AuthProvider } from "@/app/_providers/AuthProvider";
import { ReactQueryProvider } from "@/app/_providers/ReactQueryProvider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

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
      <body className="antialiased">
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <LanguageProvider>
                <LayoutClientWrapper>{children}</LayoutClientWrapper>
                <Footer />
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
