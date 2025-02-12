"use client"

import { useState, useEffect } from "react"
import { FiChevronDown, FiChevronUp, FiLogOut } from "react-icons/fi"
import { useRouter } from "next/navigation"

export const AccountToggle = () => {
  const [user, setUser] = useState({ firstname: "", lastname: "", email: "" })
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch user data from local storage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const truncateEmail = (email: string, maxLength = 20) => {
    return email.length > maxLength ? email.substring(0, maxLength) + "..." : email
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <div className="relative">
        <button
          className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src="https://api.dicebear.com/9.x/notionists/svg"
            alt="avatar"
            className="size-8 rounded shrink-0 bg-violet-500 shadow"
          />
          <div className="text-start">
            <span className="text-sm font-bold block">{`${user.firstname} ${user.lastname}`}</span>
            <span className="text-xs block text-stone-500">{truncateEmail(user.email)}</span>
          </div>

          {isOpen ? (
            <FiChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs" />
          ) : (
            <FiChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] text-xs" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-stone-300 rounded shadow-lg">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-stone-100 transition-colors"
              onClick={handleLogout}
            >
              <FiLogOut className="text-stone-500" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

