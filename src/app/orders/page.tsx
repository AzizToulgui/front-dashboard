import { TopBar } from "@/components/Dashboard/TopBar"

export default function OrdersPage() {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">
      <TopBar />
      <div className="p-4">
        <h1 className="text-xl font-semibold">Orders</h1>
        {/* Add your orders content here */}
      </div>
    </div>
  )
}

