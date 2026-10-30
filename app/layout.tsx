import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chatbot Builder",
  description: "Build, train, and share custom Groq AI chatbots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased flex flex-col min-h-screen`}
      >
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
