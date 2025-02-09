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

interface AddOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderAdded: () => void
  products: Product[]
}

const formatPrice = (price: number): string => {
  return (Math.round(price * 100) / 100).toFixed(2)
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose, onOrderAdded, products }) => {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({})
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const newTotalPrice = selectedProducts.reduce((sum, productId) => {
      const product = products.find((p) => p.id === productId)
      const quantity = productQuantities[productId] || 1
      return sum + (Number(product?.price) || 0) * quantity
    }, 0)
    setTotalPrice(newTotalPrice)
  }, [selectedProducts, productQuantities, products])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (selectedProducts.length === 0) {
        alert("Please select at least one product")
        return
      }

      const totalQuantity = Object.values(productQuantities).reduce((sum, quantity) => sum + quantity, 0)

      await axios.post("http://localhost:4000/order", {
        firstname,
        lastname,
        email,
        quantity: totalQuantity,
        productIds: selectedProducts,
        totalPrice: totalPrice,
      })

      onOrderAdded()
      onClose()
      setFirstname("")
      setLastname("")
      setEmail("")
      setSelectedProducts([])
      setProductQuantities({})
    } catch (error) {
      console.error("Error adding order:", error)
      alert("Failed to create order. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add New Order</h2>
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
                      setProductQuantities({ ...productQuantities, [product.id]: 1 })
                    } else {
                      setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                      const newQuantities = { ...productQuantities }
                      delete newQuantities[product.id]
                      setProductQuantities(newQuantities)
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`product-${product.id}`} className="text-sm mr-2">
                  {product.name} - ${formatPrice(Number(product.price))}
                </label>
                {selectedProducts.includes(product.id) && (
                  <input
                    type="number"
                    min="1"
                    value={productQuantities[product.id] || 1}
                    onChange={(e) =>
                      setProductQuantities({
                        ...productQuantities,
                        [product.id]: Math.max(1, Number.parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-20 px-2 py-1 text-sm rounded-md border border-gray-300"
                  />
                )}
              </div>
            ))}
          </div>
          {selectedProducts.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium">Total Price: ${formatPrice(totalPrice)}</span>
            </div>
          )}
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
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddOrderModal

