"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { FiDollarSign, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from "react-icons/fi"
import { EditProductModal } from "./EditProductModal"


interface Product {
  id: number
  name: string
  description: string
  image: string
  created_at: string
  modifiedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  pageCount: number
  total: number
}

export const OurProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    pageCount: 1,
    total: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchProducts = async (page = 1, search = "") => {
    try {
      setError(null)
      const { data } = await axios.get(
        `http://localhost:4000/product/all?page=${page}&limit=${paginationInfo.limit}&searchQuery=${encodeURIComponent(search)}`,
      )
      setProducts(data.data)
      setPaginationInfo({
        page: data.page,
        limit: data.limit,
        pageCount: data.pageCount,
        total: data.total,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred while fetching products")
      } else {
        setError("An unexpected error occurred")
      }
      setProducts([])
      setPaginationInfo({
        page: 1,
        limit: 10,
        pageCount: 1,
        total: 0,
      })
    }
  }

  useEffect(() => {
    fetchProducts(paginationInfo.page, searchQuery)
  }, [paginationInfo.page, paginationInfo.limit, searchQuery])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= paginationInfo.pageCount) {
      setPaginationInfo((prev) => ({ ...prev, page: newPage }))
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchProducts(1, searchQuery)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:4000/product/${productId}`)
        fetchProducts(paginationInfo.page, searchQuery)
      } catch (error) {
        console.error("Error deleting product:", error)
        setError("Failed to delete the product. Please try again.")
      }
    }
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await axios.patch(`http://localhost:4000/product/${updatedProduct.id}`, updatedProduct)
      setEditingProduct(null)
      fetchProducts(paginationInfo.page, searchQuery)
    } catch (error) {
      console.error("Error updating product:", error)
      setError("Failed to update the product. Please try again.")
    }
  }

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiDollarSign /> Latest Products
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="px-2 py-1 border rounded"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <TableHead />
            <tbody>
              {products.map((product, index) => (
                <TableRow
                  key={product.id}
                  product={product}
                  order={index + 1}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No products found.</div>
      )}
      <Pagination
        currentPage={paginationInfo.page}
        totalPages={paginationInfo.pageCount}
        onPageChange={handlePageChange}
      />
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  )
}

const TableHead = () => {
  return (
    <thead>
      <tr className="bg-gray-100">
        <th className="px-4 py-2 text-left">Order</th>
        <th className="px-4 py-2 text-left">Name</th>
        <th className="px-4 py-2 text-left">Description</th>
        <th className="px-4 py-2 text-left">Created At</th>
        <th className="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
  )
}

const TableRow = ({
  product,
  order,
  onEdit,
  onDelete,
}: { product: Product; order: number; onEdit: (product: Product) => void; onDelete: (id: number) => void }) => {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <tr className={order % 2 === 0 ? "bg-gray-50" : ""}>
      <td className="px-4 py-2">{order}</td>
      <td className="px-4 py-2">{product.name}</td>
      <td className="px-4 py-2">{product.description}</td>
      <td className="px-4 py-2">{formatDate(product.created_at)}</td>
      <td className="px-4 py-2 relative">
        <button
          className="text-violet-600 hover:text-violet-800 transition-colors"
          onClick={() => setShowActions(!showActions)}
        >
          <FiMoreHorizontal size={18} />
        </button>
        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onEdit(product)
                setShowActions(false)
              }}
            >
              <FiEdit className="inline-block mr-2" /> Edit
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => {
                onDelete(product.id)
                setShowActions(false)
              }}
            >
              <FiTrash2 className="inline-block mr-2" /> Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
      >
        <FiChevronLeft />
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 transition-colors"
      >
        <FiChevronRight />
      </button>
    </div>
  )
}

