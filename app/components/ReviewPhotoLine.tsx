"use client"

import Image from "next/image"
import { useState } from "react"

interface ReviewPhotoLineProps {
  photos: string[]
}

export function ReviewPhotoLine({ photos }: ReviewPhotoLineProps) {
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null)

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Customer Photos</h3>
      <div className="flex overflow-x-auto space-x-4">
        {photos.map((photo, index) => (
          <div key={index} className="flex-shrink-0 cursor-pointer" onClick={() => setExpandedPhoto(photo)}>
            <div className="relative w-20 h-20">
              <Image
                src={photo || "/placeholder.svg"}
                alt={`Customer photo ${index + 1}`}
                fill
                className="object-cover rounded"
              />
            </div>
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
