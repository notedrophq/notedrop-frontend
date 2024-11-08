import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notedrop",
  description: "Modern solution for students",
};

const lexendFont = Lexend({
  subsets: ["latin"],
  weight: ["300", "500", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32"></link>
      </head>
      <body className={`${lexendFont.className} antialiased`}>{children}</body>
    </html>
  );
}
