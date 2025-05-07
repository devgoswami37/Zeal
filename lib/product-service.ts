import dbConnect from "./mongodb"
import Product from "@/models/Product"
import type { Product as ProductType } from "@/app/lib/types"

// Cache for products to avoid redundant database queries
let productsCache: ProductType[] | null = null
let categoriesCache: string[] | null = null

// Function to clear the cache (useful for testing or when data changes)
export function clearProductCache() {
  productsCache = null
  categoriesCache = null
}

// Get all products
export async function getAllProducts(): Promise<ProductType[]> {
  // Use cache if available
  if (productsCache) {
    return productsCache
  }

  try {
    await dbConnect()
    const products = await Product.find({})

    // Store in cache
    productsCache = JSON.parse(JSON.stringify(products))
    return productsCache
  } catch (error) {
    console.error("Error fetching all products:", error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: string | number): Promise<ProductType | null> {
  try {
    await dbConnect()
    const product = await Product.findOne({ id: Number(id) })
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return null
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<ProductType[]> {
  try {
    await dbConnect()
    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") },
    })
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error)
    return []
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  // Use cache if available
  if (categoriesCache) {
    return categoriesCache
  }

  try {
    await dbConnect()
    const categories = await Product.distinct("category")

    // Store in cache
    categoriesCache = categories
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get all main tags
export async function getAllMainTags(): Promise<string[]> {
  try {
    await dbConnect()
    const products = await Product.find({}, "mainTags")
    const allTags = products.flatMap((product) => product.mainTags)
    return [...new Set(allTags)]
  } catch (error) {
    console.error("Error fetching main tags:", error)
    return []
  }
}

// Search products
export async function searchProducts(term: string): Promise<ProductType[]> {
  try {
    await dbConnect()
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(term, "i") } },
        { description: { $regex: new RegExp(term, "i") } },
        { category: { $regex: new RegExp(term, "i") } },
        { mainTags: { $in: [new RegExp(term, "i")] } },
      ],
    })
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error(`Error searching products for "${term}":`, error)
    return []
  }
}

// Get recommended products
export async function getRecommendedProducts(
  productId: number | string,
  category: string,
  limit = 4,
): Promise<ProductType[]> {
  try {
    await dbConnect()

    // First get products from the same category
    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") },
      id: { $ne: Number(productId) },
    }).limit(limit + 4) // Get a few extra to ensure we have enough after filtering

    const sameCategory = JSON.parse(JSON.stringify(products))

    if (sameCategory.length <= limit) {
      return sameCategory
    }

    // Use a deterministic but unique selection algorithm based on product ID
    return [...sameCategory]
      .sort((a, b) => {
        const valueA = (a.id * Number(productId)) % 100
        const valueB = (b.id * Number(productId)) % 100
        return valueA - valueB
      })
      .slice(0, limit)
  } catch (error) {
    console.error(`Error fetching recommended products for ${productId}:`, error)
    return []
  }
}
