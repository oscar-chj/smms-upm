import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";

import theme from "@/theme/theme";
import "./globals.css";

// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font display
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font display
});

// Metadata for SEO and browser tab
export const metadata: Metadata = {
  title: "Student's Merit Management System",
  description:
    "A comprehensive system for tracking university student merit points and activities",
  keywords: [
    "university",
    "merit system",
    "student achievements",
    "student management",
  ],
  authors: [{ name: "Merit System Team" }],
};

/**
 * Root layout component that wraps all pages
 * Provides theme, fonts and global styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
