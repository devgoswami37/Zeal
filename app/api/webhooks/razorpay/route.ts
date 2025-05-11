import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markCheckoutAsPaid, markCheckoutAsFailed, getCheckout } from "@/lib/checkout-service";

// Safely load the secret
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    console.error("❌ RAZORPAY_WEBHOOK_SECRET is not defined in environment variables.");
    return NextResponse.json({ success: false, error: "Webhook secret not configured" }, { status: 500 });
  }

  const bodyText = await req.text();
  const razorpaySignature = req.headers.get("x-razorpay-signature");

  // Validate signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(bodyText)
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch (error) {
    console.error("❌ Failed to parse webhook body:", error);
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  const payment = body.payload?.payment?.entity;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  const method = payment?.method;

  if (!orderId || !paymentId) {
    console.warn("⚠️ Missing order_id or payment_id in webhook payload");
    return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
  }

  const checkout = await getCheckoutByRazorpayOrderId(orderId);
  if (!checkout) {
    console.warn("⚠️ Checkout not found for Razorpay order:", orderId);
    return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 });
  }

  if (event === "payment.captured") {
    await markCheckoutAsPaid(checkout._id.toString(), method, paymentId, orderId);
    console.log("✅ Payment captured: marked as paid:", checkout._id);
  } else if (event === "payment.failed") {
    await markCheckoutAsFailed(checkout._id.toString());
    console.log("❌ Payment failed: marked as failed:", checkout._id);
  } else {
    console.log("ℹ️ Ignored event type:", event);
  }

  return NextResponse.json({ success: true });
}

// Helper function to find a checkout by order ID
async function getCheckoutByRazorpayOrderId(orderId: string) {
  const { default: Checkout } = await import("@/models/Checkout");
  const dbConnect = (await import("@/lib/mongodb")).default;
  await dbConnect();
  return await Checkout.findOne({ razorpayOrderId: orderId });
}
