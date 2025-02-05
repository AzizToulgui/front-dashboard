"use client"

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AddProductModal } from "./AddProductModal";

export const TopBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">🚀 Good morning!</span>
          <span className="text-xs block text-stone-500">
            {today}
          </span>
        </div>

        <button 
          onClick={openModal}
          className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
        >
          <FiPlus />
          <span>Add a Product</span>
        </button>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};
