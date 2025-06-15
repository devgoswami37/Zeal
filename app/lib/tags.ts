export interface TagGroup {
  mainTag: string
  relatedTags: string[]
}

export const tagGroups: TagGroup[] = [
  {
    mainTag: "saree",
    relatedTags: [
      "Women's Sarees",
      "Silk Sarees",
      "Cotton Sarees",
      "Party Wear Sarees",
      "Designer Sarees",
      "Printed Sarees",
      "Traditional Sarees",
    ],
  },
  {
    mainTag: "shirt",
    relatedTags: [
      "Women's Shirts",
      "Casual Shirts for Women",
      "Long Sleeve Shirts",
      "Formal Shirts for Women",
      "Printed Shirts",
      "Oversized Shirts",
      "Cotton Shirts for Women",
    ],
  },
  {
    mainTag: "oversized-tshirt",
    relatedTags: [
      "Oversized T-Shirts for Women",
      "Casual Loose Tees",
      "Graphic Tees for Women",
      "Drop Shoulder T-Shirts",
      "Baggy T-Shirts",
      "Streetwear T-Shirts",
      "Cotton Oversized Tees",
    ],
  },
  {
    mainTag: "sneakers",
    relatedTags: [
      "Men's Sneakers",
      "Unisex Sneakers",
      "Running Sneakers",
      "Casual Sneakers",
      "High Top Sneakers",
      "White Sneakers",
      "Chunky Sneakers",
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
