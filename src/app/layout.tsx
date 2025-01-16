'use client'
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { AppStateProvider } from '@/context/AppStateContext'
import Header from '@/components/layout/Header'
import localFont from "next/font/local"
import "./globals.css"

// Font setup
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#14171F]`}>
          <AppStateProvider>
            <Header />
            <main className="flex min-h-screen flex-col pt-20"> {/* Added pt-20 to account for fixed header height */}
              {children}
            </main>
          </AppStateProvider>
        </body>
      </ClerkProvider>
    </html>
  )
}