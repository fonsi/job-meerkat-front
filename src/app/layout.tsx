import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const isProd = process.env.APP_ENV === 'production';

export const metadata: Metadata = {
  title: "Jobmeerkat",
  description: "Don't miss your next job",
  robots: {
    index: isProd,
    follow: isProd,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
