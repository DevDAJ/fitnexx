import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TamaguiProvider } from "@/app/tamagui-provider";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitnexx | App",
  description: "",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <TamaguiProvider>{children}</TamaguiProvider>
      </body>
    </html>
  );
}
