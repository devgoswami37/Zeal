import type { IReview } from "@/models/Review";

// Helper function to upload a base64 image to Cloudinary
// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(base64Image: string) {
  try {
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', 'unsigned_review_uploadsecc'); // <-- replace with your preset

    const response = await fetch('https://api.cloudinary.com/v1_1/dqhp9pxpy/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error uploading to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}


// Fetch all reviews for a specific product
export async function getReviewsForProduct(
  productId: string, 
  sortBy = "date", 
  order = "desc"
): Promise<IReview[]> {
  try {
    const res = await fetch(`/api/reviews?productId=${productId}&sortBy=${sortBy}&order=${order}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reviews`);
    }

    const reviews = await res.json();
    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}

// Create a new review, uploading images to Cloudinary if needed
export async function createReview(reviewData: Partial<IReview>): Promise<IReview | null> {
  try {
    let cloudinaryUrls: string[] = [];

    if (reviewData.photos && reviewData.photos.length > 0) {
      cloudinaryUrls = await Promise.all(
        reviewData.photos.map(async (photo) => {
          if (photo.startsWith('data:image')) {
            return await uploadImageToCloudinary(photo); // Upload if base64
          }
          return photo; // Keep as is if already a URL
        })
      );
    }

    const reviewWithUrls = {
      ...reviewData,
      photos: cloudinaryUrls,
    };

    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewWithUrls),
    });

    if (!res.ok) {
      throw new Error("Failed to create review");
    }

    const review = await res.json();
    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    return null;
  }
}
