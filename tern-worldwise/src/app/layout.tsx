import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import "../styles/project_design.css"
import "../styles/common.css"
import "../../public/icons/style.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});


// Metadata
export const metadata: Metadata = {
  title: {
    default: "TERN – Quiz für Weltwissen",     
    template: "% | TERN",                      
  },
  description: "TERN – das interaktive Quiz zu Geschichte, Geografie, Kulturen und Natur. Finde die richtige Antwort und entdecke den Ort direkt auf einem 3D-Globus mit spannenden Fun Facts.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${newsreader.variable} ${manrope.variable} ${geistSans.variable} ${geistMono.variable} antialiased`} >
      <body
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
