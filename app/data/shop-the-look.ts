export interface ShopTheLookProduct {
  id: number
  position: {
    x: number
    y: number
  }
}

export interface ShopTheLook {
  id: number
  name: string
  image: string
  products: ShopTheLookProduct[]
}

export const shopTheLooks: ShopTheLook[] = [
  {
    id: 1,
    name: "Summer Beach Look",
    image:
      "https://palo-alto-theme-vibrant.myshopify.com/cdn/shop/files/48eda30ae3edad0c44a9defd9ca8d1f862c6b09d.jpg?v=1712930559&width=1688",
    products: [
      {
        id: 28, // Belinda Shirt
        position: {
          x: 36,
          y: 36,
        },
      },
      {
        id: 29, // Brandi Bikini Top
        position: {
          x: 59,
          y: 59,
        },
      },
      {
        id: 30, // Tonya Pants
        position: {
          x: 39,
          y: 88,
        },
      },
    ],
  },
]

export function getProductsInLook(lookId: number, products: any[]): any[] {
  const look = shopTheLooks.find((look) => look.id === lookId)
  if (!look) return []

  return products.filter((product) => look.products.some((lookProduct) => lookProduct.id === product.id))
}
