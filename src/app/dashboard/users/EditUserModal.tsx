"use client"

import type React from "react"
import { useState } from "react"
import { FiX } from "react-icons/fi"

interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  created_at: string
  modifiedAt: string
  isAdmin?: boolean
}

interface EditUserModalProps {
  user: User
  onClose: () => void
  onUpdate: (updatedUser: User) => void
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdate }) => {
  const [firstname, setFirstname] = useState(user.firstname)
  const [lastname, setLastname] = useState(user.lastname)
  const [email, setEmail] = useState(user.email)
  const [isAdmin, setIsAdmin] = useState(user.isAdmin || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedUser = {
      ...user,
      firstname,
      lastname,
      email,
      isAdmin,
    }

    try {
      await onUpdate(updatedUser)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Edit User</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-stone-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-stone-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="isAdmin" className="block text-sm font-medium text-stone-700 mb-1">
              Is Admin
            </label>
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

