import type { Product } from "@/app/lib/types"

// Cache for products to avoid redundant API calls
let productsCache: Product[] | null = null
let categoriesCache: string[] | null = null
let mainTagsCache: string[] | null = null

export async function getProducts(): Promise<Product[]> {
  // Use cache if available to reduce API calls
  if (productsCache) {
    return productsCache
  }

  try {
    const response = await fetch("/api/products", {
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const products = await response.json()

    // Store in cache for future requests
    productsCache = products
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string | number): Promise<Product | undefined> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return undefined
      }
      throw new Error(`Failed to fetch product: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    return undefined
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error)
    return []
  }
}

export async function getCategories(): Promise<string[]> {
  if (categoriesCache) {
    return categoriesCache
  }

  try {
    const response = await fetch("/api/categories", {
      next: { revalidate: 3600 }, // Cache categories for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const categories = await response.json()
    categoriesCache = categories
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getMainTags(): Promise<string[]> {
  if (mainTagsCache) {
    return mainTagsCache
  }

  try {
    const response = await fetch("/api/tags", {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`)
    }

    const tags = await response.json()
    mainTagsCache = tags
    return tags
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

export async function searchProducts(term: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?search=${encodeURIComponent(term)}`, {
      next: { revalidate: 0 }, // Don't cache search results
    })

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error searching products for "${term}":`, error)
    return []
  }
}

// Function to get recommended products with better performance
export async function getRecommendedProducts(
  productId: number | string,
  category: string,
  limit = 4,
): Promise<Product[]> {
  try {
    // First get products from the same category
    const products = await getProductsByCategory(category)
    const id = Number(productId)

    // Filter out the current product
    const sameCategory = products.filter((p) => p.id !== id)

    if (sameCategory.length <= limit) {
      return sameCategory
    }

    // Use a deterministic but unique selection algorithm based on product ID
    return [...sameCategory]
      .sort((a, b) => {
        const valueA = (a.id * id) % 100
        const valueB = (b.id * id) % 100
        return valueA - valueB
      })
      .slice(0, limit)
  } catch (error) {
    console.error(`Error fetching recommended products for ${productId}:`, error)
    return []
  }
}
