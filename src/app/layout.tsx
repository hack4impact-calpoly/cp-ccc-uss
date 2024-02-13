import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./components/NextAuthProvider";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
} ) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </NextAuthProvider>
  );
}
