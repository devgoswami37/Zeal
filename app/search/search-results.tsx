import { ProductCard } from "../components/ProductCard"
import { searchProducts } from "@/lib/data-service"

export default async function SearchResults({ query }: { query: string }) {
  const searchResults = await searchProducts(query)

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3">
        {searchResults.length} RESULTS FOR "{query}"
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {searchResults.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
