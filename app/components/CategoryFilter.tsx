"use client"

import { useState } from "react"

interface CategoryFilterProps {
  categories: string[]
  onFilterChange: (category: string) => void
}

export function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onFilterChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => handleCategoryClick("All")}
        className={`px-3 py-1 rounded-full text-sm ${
          activeCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-3 py-1 rounded-full text-sm ${
            activeCategory === category ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
