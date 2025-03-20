import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "雲科大課表轉換工具",
  description: "輕鬆將 DOCX 課表轉換為 ICS 行事曆或 Excel 表格",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant-TW" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="antialiased bg-gray-50"
        style={{ overscrollBehaviorX: "auto" }}
      >
        <Navbar
          authorName="OsGa"
          githubUrl="https://github.com/OsGa"
        />
        <main>
          {children}
        </main>
        <footer className="bg-white py-4 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
            <p>© 2025 OsGa. All Rights Reserved.</p>
            <p className="mt-1">與校方無關，自行興趣製作</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
