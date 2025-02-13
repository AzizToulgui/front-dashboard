"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import axios from "axios"

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2)
}

interface Product {
  id: number
  name: string
  price: number | string
}

interface OrderProduct {
  id: number
  quantity: number
}

interface Order {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  address: string
  products: Product[]
  productQuantities: OrderProduct[]
  created_at: string
  modifiedAt: string
  totalPrice: number | string
  status: "onProcess" | "done"
}

interface EditOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderUpdated: (order: Order) => void
  order: Order | null
  products: Product[]
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, onOrderUpdated, order, products }) => {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [status, setStatus] = useState<"onProcess" | "done">("onProcess")
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (order) {
      setFirstname(order.firstname)
      setLastname(order.lastname)
      setEmail(order.email)
      setPhoneNumber(order.phoneNumber)
      setAddress(order.address)
      setSelectedProducts(order.productQuantities)
      setStatus(order.status)
    }
  }, [order])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleProductChange = (index: number, productId: number) => {
    if (productId !== 0 && selectedProducts.some((p, i) => i !== index && p.id === productId)) {
      setError("This product is already added to the order")
      return
    }

    setError(null)
    const newSelectedProducts = [...selectedProducts]
    newSelectedProducts[index] = { ...newSelectedProducts[index], id: productId }
    setSelectedProducts(newSelectedProducts)
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newSelectedProducts = [...selectedProducts]
    newSelectedProducts[index] = { ...newSelectedProducts[index], quantity }
    setSelectedProducts(newSelectedProducts)
  }

  const addProductSelection = () => {
    setSelectedProducts([...selectedProducts, { id: 0, quantity: 1 }])
  }

  const removeProductSelection = (index: number) => {
    const newSelectedProducts = selectedProducts.filter((_, i) => i !== index)
    setSelectedProducts(newSelectedProducts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!order) return

    try {
      const validProducts = selectedProducts.filter((p) => p.id !== 0)

      if (validProducts.length === 0) {
        setError("Please select at least one product")
        return
      }

      const orderData = {
        firstname,
        lastname,
        email,
        phoneNumber,
        address,
        products: validProducts,
        status,
      }

      console.log("Sending update data:", orderData)

      const response = await axios.patch(`http://localhost:4000/order/${order.id}`, orderData)

      if (response.status === 200) {
        onOrderUpdated(response.data)
        onClose()
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error: any) {
      console.error("Error updating order:", error)
      setError(error.response?.data?.message || error.message || "Failed to update order. Please try again.")
    }
  }

  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Edit Order #{order.id}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
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
              <div>
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
            </div>
            <div>
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
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
              {selectedProducts.map((selection, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <select
                    value={selection.id}
                    onChange={(e) => handleProductChange(index, Number(e.target.value))}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  >
                    <option value={0}>Select a product</option>
                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        disabled={selectedProducts.some((p, i) => i !== index && p.id === product.id)}
                      >
                        {product.name} - ${formatPrice(product.price)}
                        {selectedProducts.some((p, i) => i !== index && p.id === product.id) ? " (Already added)" : ""}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={selection.quantity}
                    onChange={(e) => handleQuantityChange(index, Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeProductSelection(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                    aria-label="Remove product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProductSelection}
                className="mt-2 px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Product
              </button>
            </div>
            <div>
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
    </div>
  )
}

export default EditOrderModal

