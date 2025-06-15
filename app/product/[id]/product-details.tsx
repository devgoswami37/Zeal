"use client";

import { useState, useEffect } from "react";
import { Eye, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductImageCarousel } from "@/app/components/ProductImageCarousel";
import { ProductReviews } from "@/app/components/ProductReviews";
import { useCart } from "@/context/cart-context";
import { AddToCartModal } from "@/components/add-to-cart-modal";
import { getProductById } from "@/lib/data-service";
import { getReviewsForProduct } from "@/lib/review-service";
import { useQuery } from "@tanstack/react-query";

console.log("getReviewsForProduct function:", getReviewsForProduct); // Debugging log to check import

export default function ProductDetails({ productId }: { productId: string }) {
  // Fetch product details dynamically
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => {
      console.log("Fetching product details for productId:", productId);
      return getProductById(productId);
    },
    staleTime: 1000 * 60 * 5,
  });
  
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => {
      console.log("Fetching reviews for productId:", productId);
      return getReviewsForProduct(productId);
    },
    staleTime: 1000 * 60 * 5,
  });

  // Test the getReviewsForProduct function directly
  useEffect(() => {
    async function testGetReviews() {
      try {
        const fetchedReviews = await getReviewsForProduct(productId);
        console.log("Fetched reviews in ProductDetails:", fetchedReviews); // Debugging log
      } catch (error) {
        console.error("Error fetching reviews in ProductDetails:", error); // Debugging log
      }
    }
    testGetReviews();
  }, [productId]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();

  if (isProductLoading || isReviewsLoading) {
    return <div className="animate-pulse h-[600px] bg-gray-100 rounded-lg"></div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  // Set default selected color if not set yet
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0].name);
  }

  const productImages = product.additionalImages
    ? [...product.additionalImages]
    : ([product.image, product.hoverImage].filter(Boolean) as string[]);

  const colorVariants = product.colors;
  const hasReviews = reviews.length > 0;
  const averageRating = hasReviews
    ? Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      id: product.id,
      product,
      quantity,
      selectedColor,
      selectedSize,
    };

    addToCart(cartItem);
    setShowModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="w-full">
          <ProductImageCarousel images={productImages} />
        </div>

        {/* Product Details */}
        <div className="w-full">
          <div className="lg:sticky lg:top-24">
            <p className="text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

            {/* Only show reviews if there are any */}
            {hasReviews && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= averageRating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Price display showing both original and discounted price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl md:text-2xl font-bold">₹{product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-sm text-red-500 font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Color:</span>
                <span>{selectedColor}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {colorVariants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedColor(variant.name)}
                    className={`relative aspect-square border-2 ${
                      selectedColor === variant.name ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={variant.image || "/placeholder.svg"}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Size</span>
                <button className="text-gray-600 flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border ${
                      selectedSize === size ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart and Buy Now buttons */}
            <div className="flex gap-4 mb-4 w-full">
              <div className="flex border rounded-md shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 border-r">
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="w-16 text-center"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 border-l">
                  +
                </button>
              </div>
              <Button className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>

            <Button variant="secondary" className="w-full mb-4" onClick={handleAddToCart}>
              Buy it now
            </Button>

            {/* Accordion Sections */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Description
                  </div>
                </AccordionTrigger>
                <AccordionContent>{product.description}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger>Size & Fit</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4 space-y-2">
                    {product.sizeAndFit.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Only show reviews accordion if there are reviews */}
              {hasReviews && (
                <AccordionItem value="reviews">
                  <AccordionTrigger>Reviews</AccordionTrigger>
                  <AccordionContent>
                    <ProductReviews productId={product.id.toString()} reviews={reviews} />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      {showModal && (
        <AddToCartModal
          item={{
            id: product.id,
            product,
            quantity,
            selectedColor,
            selectedSize,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}