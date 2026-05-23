import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { PwaServiceWorkerRegister } from "@/components/shared/pwa-service-worker-register";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { LayoutPropsType } from "@/types/layoutProps";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk-appearance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitnexx | Privacy first gym performance and macro tracking app",
  description:
    "Privacy-first gym performance and macro tracking in your browser.",
  applicationName: "Fitnexx",
  appleWebApp: {
    capable: true,
    title: "Fitnexx",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#208b9a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutPropsType) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background">
        <ClerkProvider appearance={clerkAppearance}>
          {/* PWA: https://nextjs.org/docs/app/guides/progressive-web-apps */}
          <PwaServiceWorkerRegister />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="fitnexx-theme"
          >
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
