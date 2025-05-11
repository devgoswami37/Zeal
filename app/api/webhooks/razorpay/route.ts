import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markCheckoutAsPaid, markCheckoutAsFailed, getCheckout } from "@/lib/checkout-service";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const razorpaySignature = req.headers.get("x-razorpay-signature");

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(bodyText)
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const body = JSON.parse(bodyText);
  const event = body.event;

  const payment = body.payload?.payment?.entity;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  const method = payment?.method;

  if (!orderId || !paymentId) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const checkout = await getCheckoutByRazorpayOrderId(orderId);
  if (!checkout) {
    console.warn("⚠️ Checkout not found for order:", orderId);
    return NextResponse.json({ success: false }, { status: 404 });
  }

  if (event === "payment.captured") {
    await markCheckoutAsPaid(checkout._id.toString(), method, paymentId, orderId);
    console.log("✅ Payment captured and marked as paid:", checkout._id);
  }

  if (event === "payment.failed") {
    await markCheckoutAsFailed(checkout._id.toString());
    console.log("❌ Payment failed. Marked checkout as failed:", checkout._id);
  }

  return NextResponse.json({ success: true });
}

// Helper to find checkout by razorpay order ID
async function getCheckoutByRazorpayOrderId(orderId: string) {
  const { default: Checkout } = await import("@/models/Checkout");
  const dbConnect = (await import("@/lib/mongodb")).default;
  await dbConnect();
  return await Checkout.findOne({ razorpayOrderId: orderId });
}
