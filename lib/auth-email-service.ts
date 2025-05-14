import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const result = await resend.emails.send({
      from: "ZEAL Decor <noreply@zealdecor.store>",
      to: email,
      subject: "Reset Your Password",
      html: createPasswordResetEmail(email, token),
    })

    return result
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw new Error("Failed to send password reset email")
  }
}

function createPasswordResetEmail(email: string, token: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
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
        .verification-code {
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          margin: 30px 0;
          letter-spacing: 5px;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 15px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Reset Your Password</h1>
        </div>
        <div class="content">
          <p>We received a request to reset your password. Use the verification code below to complete the process:</p>
          
          <div class="verification-code">${token}</div>
          
          <p>This code will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ZEAL Decor. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `
}
