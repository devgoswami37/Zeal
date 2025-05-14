import type { Metadata } from "next"
import OrdersPage from "./orders-page"

export const metadata: Metadata = {
  title: "My Orders | ZEAL Decor",
  description: "View your order history",
}

export default function Orders() {
  return <OrdersPage />
}
