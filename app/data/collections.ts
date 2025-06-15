// Collection metadata with images and descriptions
export interface CollectionInfo {
  title: string
  description: string
  backgroundImage: string
  displayImage: string // Image used in the collections grid
}

export const COLLECTION_IMAGES: Record<string, CollectionInfo> = {
  "shirts": {
    title: "Shirts",
    description:
      "Dive into luxury with our Shirts. Featuring premium Italian fabrics, UV protection, and flattering cuts, these pieces are designed for both style and performance in and out of the water.",
    backgroundImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1740721606_2128477.jpg?format=webp&w=480&dpr=1.3",
    displayImage:
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1742193406_7543978.jpg?format=webp&w=480&dpr=1.3",
  },
  "oversized-t-shirts": {
    title: "Oversized T-Shirts",
    description:
      "Embrace the elements in style with our carefully curated outerwear collection. From classic leather jackets to contemporary designs, each piece combines functionality with sophisticated urban aesthetics.",
    backgroundImage:
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1714974511_1661279.jpg?format=webp&w=480&dpr=1.3",
    displayImage:
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1722525147_4109345.jpg?format=webp&w=480&dpr=1.3",
  },
  sneakers: {
    title: "Sneakers",
    description:
      "Upgrade your everyday look with our stylish tops — from comfy basics to standout pieces, perfect for any wardrobe.",
    backgroundImage: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1745837248_6457922.jpg?format=webp&w=480&dpr=1.3",
    displayImage:
      "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1749638084_2029020.jpg?format=webp&w=480&dpr=1.3",
  },
  tops: {
    title: "Tops",
    description:
      "Elevate your everyday style with our versatile tops collection. From casual essentials to statement pieces, discover comfortable and fashionable designs that seamlessly blend into your wardrobe.",
    backgroundImage: "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/one-piece_1950x.jpg?v=1652113013",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_2048x.jpg?v=1652109670",
  },
  sarees: {
    title: "Sarees",
    description:
      "Complete your look with our sophisticated Saree collection. Featuring premium materials and expert tailoring, these pieces offer both comfort and style for any occasion.",
    backgroundImage:
      "https://sudathi.com/cdn/shop/files/40RS154_5.jpg?v=1744369881&width=1100",
    displayImage:
      "https://sudathi.com/cdn/shop/files/4319S274_4.jpg?v=1743756220&width=1100",
  },
  dresses: {
    title: "Dresses",
    description:
      "Discover our stunning collection of dresses for every occasion. From elegant evening wear to casual day dresses, find your perfect style statement.",
    backgroundImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_1080x.jpg?v=1652109670",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SeaLevel-slide6_1080x.jpg?v=1652110638",
  },
  activewear: {
    title: "Activewear",
    description:
      "Push your limits in style with our performance-driven activewear collection. Designed for comfort and functionality, perfect for your active lifestyle.",
    backgroundImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_1080x.jpg?v=1652109670",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_2048x.jpg?v=1652109670",
  },
  jumpsuits: {
    title: "Jumpsuits",
    description:
      "Make a statement with our contemporary jumpsuit collection. Effortlessly chic designs that combine comfort with sophisticated style.",
    backgroundImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_1080x.jpg?v=1652109670",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SeaLevel-slide3_2048x.jpg?v=1652109992",
  },
}

// Helper function to get collection info with fallback
export function getCollectionInfo(slug: string): CollectionInfo {
  const collectionInfo = COLLECTION_IMAGES[slug]

  if (collectionInfo) {
    return collectionInfo
  }

  // Fallback for collections not in the predefined list
  return {
    title: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: "Explore our collection featuring premium quality products designed for style and comfort.",
    backgroundImage: "/placeholder.svg",
    displayImage: "/placeholder.svg",
  }
}
