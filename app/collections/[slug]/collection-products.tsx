import { ProductCard } from "@/app/components/ProductCard"
import { getProductsByCategory } from "@/lib/data-service"

export default async function CollectionProducts({ categoryName }: { categoryName: string }) {
  const collectionProducts = await getProductsByCategory(categoryName)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {collectionProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
