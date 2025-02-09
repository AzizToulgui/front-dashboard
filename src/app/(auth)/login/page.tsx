"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import type React from "react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/dashboard/products")
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex w-1/2 flex-col justify-center p-10 sm:p-16 lg:p-20">
        <div className="flex flex-col space-y-6 max-w-md mx-auto w-full">
          <div>
            <h1 className="text-3xl font-semibold">Get Started Now</h1>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <input
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                id="email"
                placeholder="Enter your email"
                type="email"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <button type="button" className="text-sm text-[#7C3AED] hover:text-[#7C3AED]/90">
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7C3AED]/90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-[#7C3AED] flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-semibold text-white mb-4">The simplest way to manage your workforce</h2>
          <p className="text-lg text-white mb-8">Enter your credentials to access your account</p>
          <div className="rounded-lg shadow-2xl overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5Hpg4HZJaT2txAJ0MHLT0GumxnpKWQ.png"
              alt="Dashboard Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

