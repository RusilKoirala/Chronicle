import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalNavigation } from "@/components/layout/conditional-navigation";
import { ConditionalMainLayout } from "@/components/layout/conditional-main-layout";
import { NavigationStateManager } from "@/components/layout/navigation-state-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { OfflineProvider } from "@/components/providers/offline-provider";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronicle - Personal Tracker",
  description: "Track your achievements, resources, goals, tasks, and routines",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chronicle"
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <OfflineProvider>
              <OfflineIndicator position="top" />
              <NavigationStateManager />
              <ConditionalNavigation />
              <ConditionalMainLayout>
                {children}
              </ConditionalMainLayout>
              <Analytics />
              <SpeedInsights />
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
