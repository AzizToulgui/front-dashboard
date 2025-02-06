"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Package, ShoppingCart } from "lucide-react"

export const RouteSelect = () => {
  const pathname = usePathname()

  const routes = [
    {
      href: "/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    
  ]

  return (
    <nav className="flex flex-col gap-2 px-2">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-200 transition-colors ${
              pathname === route.href ? "bg-stone-200" : ""
            }`}
          >
            <Icon size={20} />
            <span>{route.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

