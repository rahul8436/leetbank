import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppProvider } from "@/lib/store";
import SiteHeader from "@/components/SiteHeader";
import ServiceWorker from "@/components/ServiceWorker";
import { allKeys } from "@/lib/problems";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "LeetBank — Your Interview Problem Bank",
    template: "%s · LeetBank",
  },
  description:
    "Track your prep across 285 company-tagged coding interview problems — strategies, worked examples, and full solutions in Python, C++, Java and JavaScript.",
  metadataBase: new URL(SITE_URL),
  applicationName: "LeetBank",
  appleWebApp: { capable: true, title: "LeetBank", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "LeetBank — Your Interview Problem Bank",
    description: "285 company-tagged interview problems with strategies, solutions, and progress tracking.",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `try{var t=localStorage.getItem('leetbank:theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col pb-14 sm:pb-0">
        <AppProvider>
          <SiteHeader problemKeys={allKeys()} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/70 py-8 text-center text-xs text-muted">
            <div className="mx-auto max-w-content px-4">
              Made by <span className="font-medium text-fg-soft">Rahul Kundu</span> · © {new Date().getFullYear()}
            </div>
          </footer>
          <ServiceWorker />
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
