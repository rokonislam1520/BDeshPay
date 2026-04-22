import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "BDeshPay — বাংলাদেশের পে",
  description: "Bill Pay | Remittance | Savings — Powered by Celo",
  manifest: "/manifest.json",
  other: {
    "talentapp:project_verification":
      "e3939bdb4b3db6cf40575fa22ff8e99eb393ed1fb28ac39ba30fd3affed57c784d91fad758b8808f40ba898089d0daa120ae83f3cea2dee9b73e2bcb5005e026",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#006A4E" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-display antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
