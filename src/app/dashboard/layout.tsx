import type React from "react"
import { Sidebar } from "@/components/Sidebar/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-4 p-4 grid-cols-[220px,_1fr] ">
      <Sidebar />
      {children}
    </div>
  )
}

