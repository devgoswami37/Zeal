export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  category: string
  image: string
  hoverImage: string
  colors: {
    name: string
    image: string
  }[]
  sizes: string[]
  sizeAndFit: string[]
  inStock: boolean
  mainTags: string[]
  additionalImages?: string[] // All additional product images
  imageColorMap?: { [key: string]: number[] } // Maps color names to image indices
  badge?: string
}
