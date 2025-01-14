// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { AppStateProvider } from '@/context/AppStateContext'
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AppStateProvider>
            {children}
          </AppStateProvider>
        </body>
      </ClerkProvider>
    </html>
  )
}