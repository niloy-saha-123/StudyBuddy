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

export const metadata = {
  title: 'StudyBuddy',
  description: 'Your personalized study companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <html lang="en">
      <ClerkProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#14171F]`}>
          <AppStateProvider>
            <Header />
            <main className="flex min-h-screen flex-col pt-20"> {/* Added pt-20 to account for fixed header height */}
=======
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-background antialiased">
          <AppStateProvider>
            <main className="relative flex min-h-screen flex-col">
>>>>>>> Stashed changes
=======
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-background antialiased">
          <AppStateProvider>
            <main className="relative flex min-h-screen flex-col">
>>>>>>> Stashed changes
              {children}
            </main>
          </AppStateProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}