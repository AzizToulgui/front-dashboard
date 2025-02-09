"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { ChevronDown, Package2, Clock, User2, ShoppingCart, DollarSign, Tag, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import AddOrderModal from "./AddOrderModal"
import EditOrderModal from "./EditOrderModal"

interface Product {
  id: number
  name: string
  description: string
  price: number
}

interface Order {
  id: number
  quantity: number
  firstname: string
  lastname: string
  email: string
  products: Product[]
  created_at: string
  modifiedAt: string
  totalPrice: number | string
  status: "onProcess" | "done"
}

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2)
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, forceUpdate] = useState({})
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/order")
        setOrders(data)
      } catch (error) {
        setError("Failed to fetch orders")
        console.error("Error fetching orders:", error)
      }
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/product/all")
        setProducts(data.data)
      } catch (error) {
        setError("Failed to fetch products")
        console.error("Error fetching products:", error)
      }
    }

    Promise.all([fetchOrders(), fetchProducts()]).catch((error) => {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data")
    })

    const intervalId = setInterval(() => forceUpdate({}), 60000)

    return () => clearInterval(intervalId)
  }, [])

  const handleDelete = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return

    try {
      await axios.delete(`http://localhost:4000/order/${orderId}`)
      setOrders(orders.filter((order) => order.id !== orderId))
    } catch (error) {
      setError("Failed to delete order")
      console.error("Error deleting order:", error)
    }
  }

  const handleOrderAdded = () => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/order")
        setOrders(data)
      } catch (error) {
        setError("Failed to fetch orders")
        console.error("Error fetching orders:", error)
      }
    }
    fetchOrders()
  }

  const handleOrderUpdated = () => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/order")
        setOrders(data)
      } catch (error) {
        setError("Failed to fetch orders")
        console.error("Error fetching orders:", error)
      }
    }
    fetchOrders()
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
        <div className="flex items-center justify-between p-0.5">
          <div>
            <span className="text-sm font-bold block">🚀 Manage Orders</span>
            <span className="text-xs block text-stone-500">{today}</span>
          </div>

          <button
            onClick={() => setIsAddOrderModalOpen(true)}
            className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add order</span>
          </button>
        </div>
      </div>
      <div className="col-span-12 p-4 rounded border border-stone-300">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 font-medium">
            <Package2 className="h-4 w-4" /> Latest Orders
          </h3>
        </div>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div
                className={`p-4 bg-white hover:bg-gray-50 cursor-pointer ${
                  expandedOrder === order.id ? "border-b" : ""
                }`}
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="font-medium flex items-center gap-2">
                        Order #{order.id}
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {order.products.length} items
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "onProcess"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <User2 className="h-3 w-3" />
                        {order.firstname} {order.lastname}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />${formatPrice(order.totalPrice)}
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-500 ${
                        expandedOrder === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  expandedOrder === order.id ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <div className="p-4 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Products</h4>
                      <div className="space-y-2">
                        {order.products && order.products.length > 0 ? (
                          order.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between bg-white p-3 rounded border"
                            >
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.description}</div>
                              </div>
                              <div className="text-sm font-medium">${formatPrice(product.price)}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No products in this order.</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm">
                          <div>{order.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Total: ${formatPrice(order.totalPrice)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
        onOrderAdded={handleOrderAdded}
        products={products}
      />
      <EditOrderModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onOrderUpdated={handleOrderUpdated}
        order={editingOrder}
        products={products}
      />
    </div>
  )
}

