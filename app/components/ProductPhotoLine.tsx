"use client"

import Image from "next/image"
import { useState } from "react"

interface ProductPhotoLineProps {
  photos: string[]
}

export function ProductPhotoLine({ photos }: ProductPhotoLineProps) {
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null)

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Photos</h3>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {photos.map((photo, index) => (
          <div key={index} className="flex-shrink-0 cursor-pointer" onClick={() => setExpandedPhoto(photo)}>
            <Image
              src={photo || "/placeholder.svg"}
              alt={`Customer photo ${index + 1}`}
              width={100}
              height={100}
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
      {expandedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="relative w-full max-w-2xl h-auto">
            <Image
              src={expandedPhoto || "/placeholder.svg"}
              alt="Expanded customer photo"
              width={800}
              height={600}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
