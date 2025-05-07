// Collection metadata with images and descriptions
export interface CollectionInfo {
  title: string
  description: string
  backgroundImage: string
  displayImage: string // Image used in the collections grid
}

export const COLLECTION_IMAGES: Record<string, CollectionInfo> = {
  "sea-level-swim": {
    title: "Sea Level Swim",
    description:
      "Dive into luxury with our Sea Level Swim collection. Featuring premium Italian fabrics, UV protection, and flattering cuts, these pieces are designed for both style and performance in and out of the water.",
    backgroundImage: "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/one-piece_1950x.jpg?v=1652113013",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SeaLevel-slide3_2048x.jpg?v=1652109992",
  },
  outerwear: {
    title: "Outerwear",
    description:
      "Embrace the elements in style with our carefully curated outerwear collection. From classic leather jackets to contemporary designs, each piece combines functionality with sophisticated urban aesthetics.",
    backgroundImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_1080x.jpg?v=1652109670",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/elite-collection_460x.jpg?v=1652109934",
  },
  tops: {
    title: "Tops",
    description:
      "Elevate your everyday style with our versatile tops collection. From casual essentials to statement pieces, discover comfortable and fashionable designs that seamlessly blend into your wardrobe.",
    backgroundImage: "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/one-piece_1950x.jpg?v=1652113013",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_2048x.jpg?v=1652109670",
  },
  bottoms: {
    title: "Bottoms",
    description:
      "Complete your look with our sophisticated bottoms collection. Featuring premium materials and expert tailoring, these pieces offer both comfort and style for any occasion.",
    backgroundImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SEALEVEL-S20_007_1080x.jpg?v=1652109670",
    displayImage:
      "https://showcase-theme-mila.myshopify.com/cdn/shop/collections/SeaLevel-slide3_2048x.jpg?v=1652109992",
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
