import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: Request) {
  try {
    await dbConnect()

    // Get query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const id = url.searchParams.get("id")
    const search = url.searchParams.get("search")

    let query = {}

    // Filter by category if provided
    if (category) {
      query = { ...query, category: { $regex: new RegExp(category, "i") } }
    }

    // Filter by id if provided
    if (id) {
      query = { ...query, id: Number.parseInt(id) }
    }

    // Search by term if provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: new RegExp(search, "i") } },
          { description: { $regex: new RegExp(search, "i") } },
          { category: { $regex: new RegExp(search, "i") } },
          { mainTags: { $in: [new RegExp(search, "i")] } },
        ],
      }
    }

    const products = await Product.find(query)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json()

    // Handle single product or array of products
    if (Array.isArray(body)) {
      // Insert many products
      const products = await Product.insertMany(body)
      return NextResponse.json(products, { status: 201 })
    } else {
      // Insert a single product
      const product = new Product(body)
      await product.save()
      return NextResponse.json(product, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}