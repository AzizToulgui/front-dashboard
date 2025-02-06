import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/Sidebar/Sidebar"
import "./globals.css"
import  React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-stone-950 bg-stone-100`}>
        <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  )
}

