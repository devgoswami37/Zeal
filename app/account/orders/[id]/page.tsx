import type { Metadata } from "next"
import OrderDetailsPage from "./order-details-page"

export const metadata: Metadata = {
  title: "Order Details | ZEAL Decor",
  description: "View your order details and tracking information",
}

export default function OrderDetails() {
  return <OrderDetailsPage />
}
