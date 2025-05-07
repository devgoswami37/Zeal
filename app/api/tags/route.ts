import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET() {
  try {
    await dbConnect()

    const products = await Product.find({}, "mainTags")
    const allTags = products.flatMap((product) => product.mainTags)
    const uniqueTags = [...new Set(allTags)]

    return NextResponse.json(uniqueTags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
