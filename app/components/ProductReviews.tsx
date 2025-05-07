"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewForm } from "./ReviewForm"
import { getReviewsForProduct } from "@/lib/review-service"
import type { IReview } from "@/models/Review"

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<IReview[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const [fetchedReviews] = await Promise.all([
        getReviewsForProduct(productId, sortBy, sortOrder),
      ])
      setReviews(fetchedReviews)

      const totalRating = fetchedReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = fetchedReviews.length > 0 ? totalRating / fetchedReviews.length : 0
      setAverageRating(avgRating)
      setReviewCount(fetchedReviews.length)

    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy, sortOrder])

  const handleSortChange = (value: string) => {
    if (value === "highest") {
      setSortBy("rating")
      setSortOrder("desc")
    } else if (value === "lowest") {
      setSortBy("rating")
      setSortOrder("asc")
    } else if (value === "newest") {
      setSortBy("date")
      setSortOrder("desc")
    } else if (value === "oldest") {
      setSortBy("date")
      setSortOrder("asc")
    }
  }

  const handleReviewSubmitted = () => {
    setShowWriteReview(false)
    fetchReviews()
  }

  const allPhotos = reviews?.flatMap((review) => review.photos)

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        {reviews.length > 0 && (
          <div className="flex items-center mt-2 md:mt-0">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <Select onValueChange={handleSortChange} defaultValue="newest">
              <SelectTrigger className="w-[180px] mr-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Review Summary */}
      {reviews.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-gray-600">{reviewCount} reviews</span>
          </div>

          {/* Photo Gallery */}
          {allPhotos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Customer Photos</h3>
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {allPhotos.slice(0, 5).map((photo, index) => (
                  <div key={index} className="flex-shrink-0 cursor-pointer" onClick={() => setExpandedPhoto(photo)}>
                    <div className="relative w-16 h-16">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Customer photo ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                ))}
                {allPhotos.length > 5 && (
                  <div className="flex-shrink-0 relative w-16 h-16 bg-gray-100 rounded flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-medium">+{allPhotos.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{review.author}</span>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 ml-2">{new Date(review.date).toLocaleDateString()}</span>
              </div>

              <h3 className="font-medium mb-2">{review.title}</h3>
              <p className="mb-4 text-gray-700">{review.content}</p>

              {review.photos && review.photos.length > 0 && (
                <div className="flex overflow-x-auto space-x-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
                      onClick={() => setExpandedPhoto(photo)}
                    >
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Review photo ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </div>
      )}

      {/* Write Review Button (Always Show) */}
      <div className="text-center mt-8">
        <Button
          variant="default"
          className="w-full md:w-auto bg-black hover:bg-gray-800 text-white py-6 rounded-none"
          onClick={() => setShowWriteReview(true)}
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showWriteReview && (
        <div className="mt-8">
          <ReviewForm
            productId={productId}
            onClose={() => setShowWriteReview(false)}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      {/* Expanded Photo Modal */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="relative w-full max-w-3xl h-auto">
            <Image
              src={expandedPhoto || "/placeholder.svg"}
              alt="Expanded review photo"
              width={1200}
              height={800}
              className="object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
