import type { Metadata } from "next"
import AccountPage from "./account-page"

export const metadata: Metadata = {
  title: "My Account | ZEAL Decor",
  description: "Manage your ZEAL Decor account",
}

export default function Account() {
  return <AccountPage />
}
