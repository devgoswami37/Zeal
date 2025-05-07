import mongoose, { Schema, Document, Model } from "mongoose";

// Define the IReview interface
export interface IReview extends Document {
  productId: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  email: string;
  photos: string[];
  date: Date;
}

// Define the Review schema
const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: String, required: true },
    email: { type: String, required: true },
    photos: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ✅ Safe model initialization
const Review = (mongoose.models?.Review as Model<IReview>) || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
