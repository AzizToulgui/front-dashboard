"use client"

import type React from "react"
import { useState } from "react"
import { FiX } from "react-icons/fi"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    if (image) {
      formData.append("image", image)
    }

    try {
      const response = await fetch("http://localhost:4000/product", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const product = await response.json()
        console.log("Product added successfully:", product)
        onAdd()
        onClose()
        // Reset form fields
        setName("")
        setDescription("")
        setPrice("")
        setImage(null)
      } else {
        const errorData = await response.json()
        console.error("Failed to add product:", errorData)
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add a New Product</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-stone-700 mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-stone-700 mb-1">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full"
              accept="image/*"
              required
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal

