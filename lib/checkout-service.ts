import dbConnect from "./mongodb"
import Checkout, { type ICheckout } from "@/models/Checkout"
import type { CartState } from "@/lib/cart"
import { sendOrderStatusEmail } from "./email-service"

export async function createCheckout(checkoutData: Partial<ICheckout>): Promise<ICheckout> {
  await dbConnect()

  const checkout = new Checkout({
    ...checkoutData,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await checkout.save()
  return checkout
}

export async function updateCheckout(id: string, checkoutData: Partial<ICheckout>): Promise<ICheckout | null> {
  await dbConnect()

  const checkout = await Checkout.findByIdAndUpdate(
    id,
    {
      ...checkoutData,
      updatedAt: new Date(),
    },
    { new: true },
  )

  return checkout
}

export async function getCheckout(id: string): Promise<ICheckout | null> {
  await dbConnect()
  return await Checkout.findById(id)
}

export async function markCheckoutAsAbandoned(id: string): Promise<void> {
  await dbConnect()
  await Checkout.findByIdAndUpdate(id, {
    status: "abandoned",
    updatedAt: new Date(),
  })
}

export async function markCheckoutAsPaid(
  id: string,
  paymentMethod: string,
  paymentId: string,
  razorpayOrderId?: string,
): Promise<ICheckout | null> {
  await dbConnect()

  const checkout = await Checkout.findByIdAndUpdate(
    id,
    {
      status: "paid",
      paymentMethod,
      paymentId,
      razorpayOrderId,
      completedAt: new Date(),
      updatedAt: new Date(),
    },
    { new: true },
  )
  // Send order confirmation email
  if (checkout) {
    await sendOrderStatusEmail(checkout)
  }
  return checkout
}

export async function markCheckoutAsProcessing(id: string, razorpayOrderId: string): Promise<ICheckout | null> {
  await dbConnect()

  const checkout = await Checkout.findByIdAndUpdate(
    id,
    {
      status: "processing",
      razorpayOrderId,
      updatedAt: new Date(),
    },
    { new: true },
  )

  return checkout
}

export async function calculateShippingCost(pinCode: string): Promise<number> {
  // This is a placeholder function - you would implement your actual shipping cost calculation logic here
  // For now, we'll return a fixed shipping cost
  return 0.01 // ₹50 shipping cost
}

export async function getAbandonedCheckouts(daysAgo = 7): Promise<ICheckout[]> {
  await dbConnect()

  const date = new Date()
  date.setDate(date.getDate() - daysAgo)

  return await Checkout.find({
    status: "pending",
    createdAt: { $lt: date },
  })
}
// export async function markCheckoutAsFailed(id: string): Promise<void> {
//   await dbConnect();
//   await Checkout.findByIdAndUpdate(id, {
//     status: "failed",
//     updatedAt: new Date(),
//   });
// }
export async function markCheckoutAsFailed(id: string, reason?: string): Promise<ICheckout | null> {
  await dbConnect()

  const checkout = await Checkout.findByIdAndUpdate(
    id,
    {
      status: "failed",
      notes: reason || "Payment failed",
      updatedAt: new Date(),
    },
    { new: true }
  )

  // Optionally send email notification
  if (checkout) {
    await sendOrderStatusEmail(checkout)
  }

  return checkout
}

export async function prepareCheckoutFromCart(
  cart: CartState,
  email: string,
  phone: string,
): Promise<Partial<ICheckout>> {
  const cartItems = cart.items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    color: item.selectedColor,
    size: item.selectedSize,
    image: item.product.image || item.product.images?.[0] || "/placeholder.svg",
  }))

  const subtotal = cart.subtotal
  // Shipping cost will be calculated later when we have the address
  const shippingCost = 0
  const total = subtotal + shippingCost

  return {
    email,
    phone,
    cartItems,
    subtotal,
    shippingCost,
    total,
    status: "pending",
  }
}
