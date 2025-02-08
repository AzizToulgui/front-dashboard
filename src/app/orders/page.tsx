"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { ChevronDown, Package2, Clock, User2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Product {
  id: number
  name: string
  description: string
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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, forceUpdate] = useState({})

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

    fetchOrders()

    // Update time every minute
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

  return (
    <div className="bg-white rounded-lg p-4 shadow">
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
                        {order.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between bg-white p-3 rounded border"
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </div>
                        ))}
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
                    <div className="flex justify-end">
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
          ))}
        </div>
      </div>
    </div>
  )
}

