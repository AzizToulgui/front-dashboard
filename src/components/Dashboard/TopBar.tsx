"use client"

import  React from "react"
import { useState, type ReactNode } from "react"
import { FiPlus } from "react-icons/fi"

interface TopBarProps {
  greeting?: string
  actionLabel?: string
  actionIcon?: ReactNode
  onActionClick?: () => void
  renderModal?: () => ReactNode
}

export const TopBar: React.FC<TopBarProps> = ({
  greeting = "Good morning!",
  actionLabel = "Add",
  actionIcon = <FiPlus />,
  onActionClick,
  renderModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const openModal = () => {
    if (onActionClick) {
      onActionClick()
    } else {
      setIsModalOpen(true)
    }
  }
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">🚀 {greeting}</span>
          <span className="text-xs block text-stone-500">{today}</span>
        </div>

        <button
          onClick={openModal}
          className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      </div>

      {renderModal && isModalOpen && renderModal()}
    </div>
  )
}

