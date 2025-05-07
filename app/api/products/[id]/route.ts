import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Destructure params directly in the function arguments
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await Product.findOne({ id: Number.parseInt(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const product = await Product.findOneAndUpdate({ id: Number.parseInt(id) }, body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await Product.findOneAndDelete({ id: Number.parseInt(id) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}