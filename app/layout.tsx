import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WhaleNotificationProvider } from "@/lib/whale-notifications";

const mulish = localFont({
  src: [
    { path: "../public/assets/fonts/Mulish-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/assets/fonts/Mulish-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../public/assets/fonts/Mulish-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/assets/fonts/Mulish-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/assets/fonts/Mulish-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/assets/fonts/Mulish-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/assets/fonts/Mulish-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/Mulish-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/assets/fonts/Mulish-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/assets/fonts/Mulish-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../public/assets/fonts/Mulish-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/assets/fonts/Mulish-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../public/assets/fonts/Mulish-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/assets/fonts/Mulish-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../public/assets/fonts/Mulish-Black.ttf", weight: "900", style: "normal" },
    { path: "../public/assets/fonts/Mulish-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CryptoViz — Real-time Crypto Analytics",
  description: "Professional real-time cryptocurrency analytics dashboard with live charts, whale tracking, and sentiment analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${mulish.variable} antialiased bg-[#050507] text-white`}
      >
        <WhaleNotificationProvider>
          <main className="relative z-10 ml-64 min-h-screen px-8 py-6">{children}</main>
        </WhaleNotificationProvider>
      </body>
    </html>
  );
}
