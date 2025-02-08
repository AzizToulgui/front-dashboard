"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { FiMoreHorizontal, FiUserPlus } from "react-icons/fi"
import { Users } from "lucide-react"
import { TopBar } from "@/components/Dashboard/TopBar"
import { EditUserModal } from "./EditUserModal"
import AddUserModal from "./AddUserModal"

interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  created_at: string
  modifiedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  pageCount: number
  total: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    pageCount: 1,
    total: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setError(null)
      const { data } = await axios.get(
        `http://localhost:4000/user?page=${page}&limit=${paginationInfo.limit}&searchQuery=${encodeURIComponent(search)}`,
      )
      setUsers(data.data)
      setPaginationInfo({
        page: data.page,
        limit: data.limit,
        pageCount: data.pageCount,
        total: data.total,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred while fetching users")
      } else {
        setError("An unexpected error occurred")
      }
      setUsers([])
      setPaginationInfo({
        page: 1,
        limit: 10,
        pageCount: 1,
        total: 0,
      })
    }
  }

  useEffect(() => {
    fetchUsers(paginationInfo.page, searchQuery)
  }, [paginationInfo.page, paginationInfo.limit, searchQuery])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchUsers(1, searchQuery)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:4000/user/${userId}`)
        fetchUsers(paginationInfo.page, searchQuery)
      } catch (error) {
        console.error("Error deleting user:", error)
        setError("Failed to delete the user. Please try again.")
      }
    }
  }

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await axios.patch(`http://localhost:4000/user/${updatedUser.id}`, updatedUser)
      setEditingUser(null)
      fetchUsers(paginationInfo.page, searchQuery)
    } catch (error) {
      console.error("Error updating user:", error)
      setError("Failed to update the user. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <TopBar
        greeting="Manage Users"
        actionLabel="Add User"
        actionIcon={<FiUserPlus />}
        onActionClick={() => setIsAddUserModalOpen(true)}
      />
      <div className="col-span-12 p-4 rounded border border-stone-300 ">
        <div className="mb-4 flex items-center justify-between ">
          <h3 className="flex items-center gap-1.5 font-medium">
            <Users className="h-4 w-4" /> Latest Users
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="px-3 py-1 border rounded-md"
            />
          </form>
        </div>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date added</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
        {editingUser && (
          <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />
        )}
        {isAddUserModalOpen && (
          <AddUserModal
            isOpen={isAddUserModalOpen}
            onClose={() => setIsAddUserModalOpen(false)}
            onAdd={() => {
              fetchUsers(paginationInfo.page, searchQuery)
            }}
          />
        )}
      </div>
    </div>
  )
}

const TableRow = ({
  user,
  onEdit,
  onDelete,
}: {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}) => {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=random`}
            alt={`${user.firstname} ${user.lastname}`}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{`${user.firstname} ${user.lastname}`}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-500">{formatDate(user.created_at)}</td>
      <td className="py-3 px-4 relative">
        <button className="p-1 hover:bg-gray-100 rounded-full" onClick={() => setShowActions(!showActions)}>
          <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
            <div className="py-1">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onEdit(user)
                  setShowActions(false)
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  onDelete(user.id)
                  setShowActions(false)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

