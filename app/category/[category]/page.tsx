import { products } from "../../data/products"
import { ProductCard } from "../../components/ProductCard"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === params.category.toLowerCase(),
  )

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products in {params.category}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
