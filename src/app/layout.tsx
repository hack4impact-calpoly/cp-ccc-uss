import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "./components/NextAuthProvider";
import { Providers } from "./providers";
import { fonts } from "./styles/fonts";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

export const metadata: Metadata = {
  title: "CCC-USS Volunteers",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <ClerkProvider>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" ></link>
      <html lang="en" className={fonts.dmSans.className}>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
