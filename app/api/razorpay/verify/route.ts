import { type NextRequest, NextResponse } from "next/server";
import { getCheckout, markCheckoutAsPaid, markCheckoutAsFailed } from "@/lib/checkout-service";
import { verifyRazorpayPayment } from "@/lib/razorpay-service";

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    // Log incoming request data
    console.log("Received payment verification request:", {
      checkoutId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    // Validate request data
    if (!checkoutId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      console.error("Missing required parameters");
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    // Fetch checkout document
    console.log("Fetching checkout document for ID:", checkoutId);
    const checkout = await getCheckout(checkoutId);
    if (!checkout) {
      console.error("Checkout not found for ID:", checkoutId);
      return NextResponse.json({ success: false, error: "Checkout not found" }, { status: 404 });
    }

    // Verify payment signature
    console.log("Verifying Razorpay payment signature...");
    const isValid = verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (isValid) {
      console.log("Payment signature verified successfully for checkout ID:", checkoutId);

      // Mark as paid
      const updatedCheckout = await markCheckoutAsPaid(
        checkoutId,
        "razorpay",
        razorpayPaymentId,
        razorpayOrderId
      );
      console.log("Checkout marked as paid:", updatedCheckout);

      // Optionally store signature
      console.log("Storing Razorpay payment details in checkout document...");
      await checkout.updateOne({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      // Return success response
      console.log("Returning success response with checkout ID:", updatedCheckout._id);
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        checkoutId: checkout._id,
      checkout,
      });
    } else {
      // Signature invalid — mark as failed
      console.error("Invalid payment signature for checkout ID:", checkoutId);
      await markCheckoutAsFailed(checkoutId, "Payment signature verification failed");

      return NextResponse.json({
        success: false,
        error: "Invalid payment signature",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to verify payment",
    }, { status: 500 });
  }
}