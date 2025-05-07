export interface TagGroup {
  mainTag: string
  relatedTags: string[]
}

export const tagGroups: TagGroup[] = [
  {
    mainTag: "shirt",
    relatedTags: [
      "Men's Shirts",
      "Casual Shirts for Men",
      "Long Sleeve Shirts",
      "Slim Fit Shirts",
      "Checked Shirts",
      "Plain Shirts for Men",
      "Men's Formal Shirts",
    ],
  },
  {
    mainTag: "dress",
    relatedTags: [
      "Women's Dresses",
      "Casual Dresses",
      "Party Dresses",
      "Maxi Dresses",
      "Summer Dresses",
      "Evening Dresses",
      "Floral Dresses",
    ],
  },
  {
    mainTag: "jeans",
    relatedTags: [
      "Men's Jeans",
      "Women's Jeans",
      "Slim Fit Jeans",
      "Straight Fit Jeans",
      "Skinny Jeans",
      "Ripped Jeans",
      "High-Waist Jeans",
    ],
  },
  {
    mainTag: "jacket",
    relatedTags: [
      "Winter Jackets",
      "Leather Jackets",
      "Denim Jackets",
      "Bomber Jackets",
      "Waterproof Jackets",
      "Sports Jackets",
      "Casual Jackets",
    ],
  },
  {
    mainTag: "swimwear",
    relatedTags: [
      "One-Piece Swimsuits",
      "Bikinis",
      "Swimming Trunks",
      "Beach Wear",
      "Swim Shorts",
      "Athletic Swimwear",
      "Designer Swimwear",
    ],
  },
]

export function findRelatedTags(searchTerm: string): string[] {
  const normalizedSearch = searchTerm.toLowerCase()

  // Find exact matches first
  const exactMatch = tagGroups.find((group) => group.mainTag.toLowerCase() === normalizedSearch)
  if (exactMatch) {
    return exactMatch.relatedTags
  }

  // Find partial matches in main tags
  const mainTagMatch = tagGroups.find((group) => group.mainTag.toLowerCase().includes(normalizedSearch))
  if (mainTagMatch) {
    return mainTagMatch.relatedTags
  }

  // Find matches in related tags
  for (const group of tagGroups) {
    if (group.relatedTags.some((tag) => tag.toLowerCase().includes(normalizedSearch))) {
      return group.relatedTags
    }
  }

  return []
}

export function getAllRelatedTags(mainTags: string[]): string[] {
  const allRelatedTags: string[] = []

  mainTags.forEach((mainTag) => {
    const group = tagGroups.find((g) => g.mainTag.toLowerCase() === mainTag.toLowerCase())
    if (group) {
      allRelatedTags.push(group.mainTag, ...group.relatedTags)
    }
  })

  return [...new Set(allRelatedTags)] // Remove duplicates
}

export function isMatchingTag(searchTerm: string, mainTags: string[]): boolean {
  const normalizedSearch = searchTerm.toLowerCase()
  const relatedTags = getAllRelatedTags(mainTags)

  return relatedTags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
}
