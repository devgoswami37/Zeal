import mongoose, { Schema, type Document } from "mongoose"

export interface ICheckout extends Document {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  state: string
  pinCode: string
  country: string
  saveInformation: boolean
  billingAddressSameAsShipping: boolean
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    apartment?: string
    city: string
    state: string
    pinCode: string
    country: string
  }
  cartItems: Array<{
    productId: mongoose.Types.ObjectId
    name: string
    price: number
    quantity: number
    color: string
    size: string
    image: string
  }>
  subtotal: number
  shippingCost: number
  total: number
  status: "pending" | "processing" | "paid" | "abandoned" | "completed" | "failed"
  marketingConsent: boolean
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  paymentMethod?: string
  paymentId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  notes?: string
  ipAddress?: string
  userAgent?: string
}

const CheckoutSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    saveInformation: { type: Boolean, default: false },
    billingAddressSameAsShipping: { type: Boolean, default: true },
    billingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      apartment: { type: String },
      city: { type: String },
      state: { type: String },
      pinCode: { type: String },
      country: { type: String },
    },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String },
        size: { type: String },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "paid", "abandoned", "completed", "failed"],
      default: "pending",
    },
    marketingConsent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    paymentMethod: { type: String },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    notes: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  },
)

// Create or use existing model
export default mongoose.models.Checkout || mongoose.model<ICheckout>("Checkout", CheckoutSchema)
