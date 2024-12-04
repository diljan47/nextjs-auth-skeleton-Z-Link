import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./lib/dbConnect";
import { dbConnect } from "./lib/dbConnect";
import { ThemeProvider } from "next-themes";
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

export const metadata: Metadata = {
  title: "Z-Link-Auth | Simple and secure authentication system",
  description: "Z-Link-Auth is a simple and secure authentication system for your next project",
  icons: {
    icon: "/favicon.svg", 
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await dbConnect();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
