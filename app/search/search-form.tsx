"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X, QrCode, Search } from "lucide-react"
import debounce from "lodash/debounce"

export default function SearchForm() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")

  // Debounced search function to prevent excessive URL updates
  const debouncedSearch = debounce((term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`)
    }
  }, 500)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length > 2) {
      debouncedSearch(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  const handleClear = () => {
    setInputValue("")
    router.push("/search")
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="bg-white sticky top-0 z-50 px-4 py-3 flex items-center gap-3 border-b">
      <button onClick={handleBack} className="p-2">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for products, brands and more..."
            className="w-full py-2 pl-4 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {inputValue && (
            <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        <button type="submit" className="p-2">
          <Search className="h-5 w-5" />
        </button>
      </form>
      <button className="p-2">
        <QrCode className="h-5 w-5" />
      </button>
    </div>
  )
}
