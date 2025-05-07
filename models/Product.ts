import mongoose, { Schema, type Document } from "mongoose"

// Define the color schema
const ColorSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
})

// Define the image color map schema
const ImageColorMapSchema = new Schema({}, { strict: false })

// Define the product schema
const ProductSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    hoverImage: { type: String, required: true },
    colors: [ColorSchema],
    sizes: [String],
    sizeAndFit: [String],
    inStock: { type: Boolean, default: true },
    mainTags: [String],
    additionalImages: [String],
    imageColorMap: { type: ImageColorMapSchema, default: {} },
    badge: { type: String },
  },
  {
    timestamps: true,
  },
)

// Create and export the model
export interface IProduct extends Document {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  category: string
  image: string
  hoverImage: string
  colors: Array<{
    name: string
    image: string
  }>
  sizes: string[]
  sizeAndFit: string[]
  inStock: boolean
  mainTags: string[]
  additionalImages?: string[]
  imageColorMap?: { [key: string]: number[] }
  badge?: string
}

// Check if the model already exists to prevent OverwriteModelError during hot reloads
export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
