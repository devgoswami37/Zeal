import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Review from "@/models/Review"
import { cloudinary } from "@/lib/cloudinaryConfig"

// GET all reviews or reviews for a specific product
export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get query parameters
    const url = new URL(request.url)
    const productId = url.searchParams.get("productId")
    const sortBy = url.searchParams.get("sortBy") || "date"
    const order = url.searchParams.get("order") || "desc"

    // Build query
    const query = productId ? { productId } : {}

    // Build sort options
    let sortOptions = {}
    if (sortBy === "rating") {
      sortOptions = { rating: order === "asc" ? 1 : -1 }
    } else if (sortBy === "date") {
      sortOptions = { date: order === "asc" ? 1 : -1 }
    }

    // Fetch reviews
    const reviews = await Review.find(query).sort(sortOptions)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST a new review
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json()

    // If there's an image in base64 format
    if (body.image) {
      try {
        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(body.image, {
          folder: "reviews", // Optional: organize in folders
          resource_type:auto        });

        // Replace base64 image with Cloudinary URL
        body.image = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" }, 
          { status: 500 }
        );
      }
    }

    // Create new review with Cloudinary URL
    const review = new Review(body)
    await review.save()

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" }, 
      { status: 500 }
    )
  }
}
