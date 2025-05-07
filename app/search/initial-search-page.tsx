import Link from "next/link"
import Image from "next/image"
import { getCategories, getMainTags } from "@/lib/data-service"

const popularCategories = [
  {
    name: "Women",
    image: "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/one-piece_1950x.jpg?v=1652113013",
    link: "/collections/outerwear",
  },
  {
    name: "Men",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/men",
  },
  {
    name: "Kids",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/kids",
  },
  {
    name: "Sunglasses",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/sunglasses",
  },
  {
    name: "Home",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/home",
  },
  {
    name: "Hot Brands",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-02%20at%2020.21.44_cee6f0bc.jpg-JLYcQ69OzxU2DUZxCe4n1B1UfOHoMO.jpeg",
    link: "/collections/hot-brands",
  },
]

export default async function InitialSearchPage() {
  const categories = await getCategories()
  const mainTags = await getMainTags()

  // Select top trending searches from main tags
  const trendingSearches = mainTags.slice(0, 8)

  return (
    <div>
      {/* Trending Searches */}
      <section className="mb-8">
        <h2 className="text-sm font-bold mb-4">Trending Searches</h2>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="px-4 py-2 rounded-full border hover:bg-gray-100"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-3 gap-4">
          {popularCategories.map((category) => (
            <Link key={category.name} href={category.link} className="text-center space-y-2">
              <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 20vw"
                  loading="lazy"
                />
              </div>
              <p className="font-medium">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
