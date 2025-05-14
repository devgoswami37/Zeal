import mongoose, { type Document, Schema } from "mongoose"

export interface IPasswordReset extends Document {
  email: string
  token: string
  createdAt: Date
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token expires after 1 hour
  },
})

export default mongoose.models.PasswordReset || mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema)
