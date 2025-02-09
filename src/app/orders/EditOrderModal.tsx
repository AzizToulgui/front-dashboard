"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"

interface Product {
  id: number
  name: string
  price: number
}

interface Order {
  id: number
  firstname: string
  lastname: string
  email: string
  products: Product[]
  status: "onProcess" | "done"
}

interface EditOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderUpdated: () => void
  order: Order | null
  products: Product[]
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, onOrderUpdated, order, products }) => {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [status, setStatus] = useState<"onProcess" | "done">("onProcess")

  useEffect(() => {
    if (order) {
      setFirstname(order.firstname)
      setLastname(order.lastname)
      setEmail(order.email)
      setSelectedProducts(order.products.map((p) => p.id))
      setStatus(order.status)
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!order) return

    try {
      await axios.patch(`http://localhost:4000/order/${order.id}`, {
        firstname,
        lastname,
        email,
        productIds: selectedProducts,
        status,
      })
      onOrderUpdated()
      onClose()
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Edit Order #{order.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
            {products.map((product) => (
              <div key={product.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  value={product.id}
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, product.id])
                    } else {
                      setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`product-${product.id}`} className="text-sm">
                  {product.name} - ${product.price}
                </label>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "onProcess" | "done")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="onProcess">On Process</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditOrderModal

