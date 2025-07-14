
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { LayoutProvider } from './context/LayoutContext';
import LayoutWrapper from "./LayoutWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chat App",
  description: "create my Karthi",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased">
             <LayoutProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </LayoutProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
