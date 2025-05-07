"use client"

import { useState, useRef } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createReview } from "@/lib/review-service"
import Image from "next/image"

interface ReviewFormProps {
  productId: string
  onClose: () => void
  onReviewSubmitted: () => void
}

export function ReviewForm({ productId, onClose, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [email, setEmail] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [photoData, setPhotoData] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Convert files to base64
    const processFile = async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64Photos = await Promise.all(
        Array.from(files).map(file => processFile(file))
      );
      
      // Store base64 strings temporarily for preview
      const previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(previewUrls); // For preview purposes
      
      // Store base64 data for submission
      setPhotoData(base64Photos); // Add this new state for storing base64 data
    } catch (error) {
      console.error("Error processing files:", error);
      setError("Failed to process images. Please try again.");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (!title.trim()) {
      setError("Please enter a review title")
      return
    }

    if (!content.trim()) {
      setError("Please enter your review")
      return
    }

    if (!author.trim()) {
      setError("Please enter your name")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    try {
      setIsSubmitting(true)

      // In a real app, you would upload photos to a storage service
      // and get back URLs to store in the database

      const reviewData = {
        productId,
        title,
        content,
        rating,
        author,
        email,
        photos: photoData, // Send base64 data instead of blob URLs
        date: new Date(),
      }

      await createReview(reviewData)

      // Cleanup
      photos.forEach(photo => URL.revokeObjectURL(photo));
      
      // Reset form
      setRating(0);
      setTitle("");
      setContent("");
      setAuthor("");
      setEmail("");
      setPhotos([]);
      setPhotoData([]); // Clear photo data

      // Notify parent component
      onReviewSubmitted()
    } catch (err) {
      console.error("Error submitting review:", err)
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Write a review</h2>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center uppercase">Rating</label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
                onMouseLeave={handleRatingLeave}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoveredRating ? value <= hoveredRating : value <= rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full"
          />
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comments here"
            className="w-full min-h-[150px]"
          />
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center uppercase">
            Picture/Video (Optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-20 h-20">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Review photo ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="024 24 stroke=currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {/* Author Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name (displayed publicly)</label>
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name (public)"
            className="w-full"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email (private)</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email (private)"
            className="w-full"
          />
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 text-sm text-gray-500 text-center">
          <p>How we use your data: We'll only contact you about the review you left, and only if necessary.</p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-800 text-white py-6">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>

          <Button type="button" variant="outline" onClick={onClose} className="w-full">
            Cancel review
          </Button>
        </div>
      </form>
    </div>
  )
}
