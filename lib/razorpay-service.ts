import type { ICheckout } from "@/models/Checkout"
import crypto from "crypto"

// Replace with your actual Razorpay API keys
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay environment variables in razorpay-services")
}
// Initialize Razorpay
export async function createRazorpayOrder(checkout: ICheckout) {
  try {
    const amount = Math.round(checkout.total * 100) // Razorpay expects amount in paise (smallest currency unit)

    // Ensure that 'state' is available in the 'checkout' object
    const state = checkout.state;  // Assuming 'state' is part of the 'checkout' object
    console.log("Creating Razorpay order - State received:", state);
    if (!state) {
      throw new Error("State is required for checkout creation");
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `receipt_${checkout._id}`,
        notes: {
          checkoutId: checkout._id.toString(),
          customerEmail: checkout.email,
          customerPhone: checkout.phone,
          state, // Add the 'state' field here
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Razorpay API error: ${errorData.error.description}`)
    }

    const order = await response.json()
    return order
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    // Generate a signature using the order_id and payment_id
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex")

    // Compare the generated signature with the signature received from Razorpay
    const isAuthentic = expectedSignature === razorpaySignature

    return isAuthentic
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return false
  }
}

export function getRazorpayConfig() {
  return {
    key_id: RAZORPAY_KEY_ID,
  }
}
