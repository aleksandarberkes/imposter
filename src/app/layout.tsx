import type { Metadata, Viewport } from "next";
import { Bungee, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Imposter",
    template: "%s · Imposter",
  },
  description: "Pass-the-phone party game. One of you is lying.",
  applicationName: "Imposter",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Imposter",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bungee.variable} ${grotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
