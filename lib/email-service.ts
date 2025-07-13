import nodemailer from "nodemailer"
import { Resend } from "resend"
import type { ICheckout } from "@/models/Checkout"
import { formatCurrency } from "./utils"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Create a nodemailer transporter using Resend
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
})

// Email templates
export const createOrderConfirmationEmail = (checkout: ICheckout) => {
  const { firstName, lastName, email, cartItems, subtotal, shippingCost, total } = checkout

  // Format the order date
  const orderDate = new Date(checkout.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
// Format the current date and time in a way that looks like part of the order ID
const currentDateTime = new Date();
const obfuscatedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1)
  .toString()
  .padStart(2, "0")}${currentDateTime.getDate().toString().padStart(2, "0")}${currentDateTime
  .getHours()
  .toString()
  .padStart(2, "0")}${currentDateTime.getMinutes().toString().padStart(2, "0")}${currentDateTime
  .getSeconds()
  .toString()
  .padStart(2, "0")}`;

// Prepend a common 3-digit number and append the obfuscated date and time to the checkout ID
const formattedOrderId = `672${checkout._id}${obfuscatedDateTime}`;
const orderTrackLink = `https://www.zealdecor.store/checkout/success?id=${checkout._id}`;


  // Create the items HTML
  const itemsHtml = cartItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
          <div>
            <p style="margin: 0; font-weight: 500;">${item.name}</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              ${item.color ? `Color: ${item.color}` : ""}
              ${item.size ? ` | Size: ${item.size}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #000000;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .order-info {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .order-summary {
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          padding: 10px;
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 15px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        .button {
          display: inline-block;
          background-color: #000000;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
        .total-row {
          font-weight: bold;
          background-color: #f9fafb;
        }
        .thank-you {
          text-align: center;
          margin-top: 30px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for your order! We're excited to confirm that your order has been received and is being processed.</p>
          
          <div class="order-info">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order ID:</strong> ${formattedOrderId}</p>
            <p><strong>Payment Method:</strong> ${checkout.paymentMethod || "Online Payment"}</p>
          </div>
          
          <div class="order-summary">
            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">Product</th>
                  <th style="width: 15%; text-align: center;">Qty</th>
                  <th style="width: 15%; text-align: right;">Price</th>
                  <th style="width: 20%; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;"><strong>Subtotal</strong></td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;"><strong>Shipping</strong></td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(shippingCost)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;"><strong>Total</strong></td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">${formatCurrency(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="shipping-info">
            <h3>Shipping Information</h3>
            <p>
              ${firstName} ${lastName}<br>
              ${checkout.address}${checkout.apartment ? `, ${checkout.apartment}` : ""}<br>
              ${checkout.city}, ${checkout.state} ${checkout.pinCode}<br>
              ${checkout.country}<br>
              Phone: ${checkout.phone}
            </p>
          </div>
          
          <div class="thank-you">
            <p>If you have any questions about your order, please contact our customer service.</p>
            <a href="${orderTrackLink}" class="button">Track Your Order</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const createPaymentFailedEmail = (checkout: ICheckout) => {
  const { firstName, lastName, email } = checkout

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #ef4444;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #000000;
          color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 15px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        .message {
          text-align: center;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Payment Failed</h1>
        </div>
        <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          <p>We're sorry to inform you that your recent payment attempt was unsuccessful.</p>
          
          <div class="message">
            <h3>What happened?</h3>
            <p>Your payment could not be processed due to an issue with the payment method. This could be due to insufficient funds, expired card details, or a temporary issue with the payment gateway.</p>
            
            <h3>What should you do next?</h3>
            <p>You can try again with a different payment method or check with your bank to ensure there are no issues with your account.</p>
            
            <a href="https://your-store-url.com/checkout" class="button">Try Again</a>
          </div>
          
          <p>If you continue to experience issues or have any questions, please don't hesitate to contact our customer support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (checkout: ICheckout) => {
  try {
    const mailOptions = {
      from: "ZEAL Decor <orders@zealdecor.store>",
      to: checkout.email,
      subject: "Your Order Confirmation",
      html: createOrderConfirmationEmail(checkout),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Order confirmation email sent to ${checkout.email}`)
    return true
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return false
  }
}

// Function to send payment failed email
export const sendPaymentFailedEmail = async (checkout: ICheckout) => {
  try {
    const mailOptions = {
      from: "ZEAL Decor <support@zealdecor.store>",
      to: checkout.email,
      subject: "Payment Failed - Action Required",
      html: createPaymentFailedEmail(checkout),
    }

    await transporter.sendMail(mailOptions)
    console.log(`Payment failed email sent to ${checkout.email}`)
    return true
  } catch (error) {
    console.error("Error sending payment failed email:", error)
    return false
  }
}

// Function to send email based on order status
export const sendOrderStatusEmail = async (checkout: ICheckout) => {
  if (checkout.status === "paid" || checkout.status === "completed") {
    return await sendOrderConfirmationEmail(checkout)
  } else if (checkout.status === "failed") {
    return await sendPaymentFailedEmail(checkout)
  }
  return false
}
