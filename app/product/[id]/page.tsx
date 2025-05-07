"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/lib/data-service";
import type { Product } from "@/app/lib/types";
import { ProductImageCarousel } from "@/app/components/ProductImageCarousel";
import { useCart } from "@/context/cart-context";
import LoadingSpinner from "@/app/components/loading-spinner";
import Header from "@/app/components/header";
import RecommendedProducts from "./recommended-products";
import { getReviewsForProduct } from "@/lib/review-service";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartModal } from "@/components/add-to-cart-modal";
import { ProductReviews } from "@/app/components/ProductReviews";


export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [hasReviews, setHasReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const carouselRef = useRef<any>(null);
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { id } = params;
        const fetchedProduct = await getProductById(id);

        if (!fetchedProduct) {
          router.push("/products");
          return;
        }

        setProduct(fetchedProduct);

        // Set default selected color and size
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0].name);
        }

        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params, router]);

  // Fetch reviews for the product
  useEffect(() => {
    async function fetchReviews() {
      try {
        const fetchedReviews = await getReviewsForProduct(product?.id);
        setReviews(fetchedReviews);

        if (fetchedReviews.length > 0) {
          setHasReviews(true);
          const avgRating =
            fetchedReviews.reduce((acc, review) => acc + review.rating, 0) /
            fetchedReviews.length;
          setAverageRating(Math.round(avgRating));
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);

    if (product?.imageColorMap && product.imageColorMap[colorName]) {
      const colorImageIndex = product.imageColorMap[colorName][0];
      setCurrentImageIndex(colorImageIndex);

      if (carouselRef.current) {
        carouselRef.current.scrollToIndex(colorImageIndex);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
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

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-4">Sorry, the product you are looking for does not exist.</p>
          <button onClick={() => router.push("/products")} className="bg-black text-white px-4 py-2 rounded">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Prepare all images for the carousel
  const allImages = [product.image];
  if (product.hoverImage && product.hoverImage !== product.image) {
    allImages.push(product.hoverImage);
  }
  if (product.additionalImages && product.additionalImages.length > 0) {
    allImages.push(...product.additionalImages);
  }

  return (
    <>
      <Header />
      <div className="container max-w-6xl mx-auto px-4 py-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="w-full">
            <ProductImageCarousel
              images={allImages}
              ref={carouselRef}
              currentIndex={currentImageIndex}
              onIndexChange={handleImageIndexChange}
            />
          </div>

          {/* Product Details */}
          <div className="w-full">
            <div className="lg:sticky lg:top-24">
              <p className="text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              {/* Reviews */}
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

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xl md:text-2xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-sm text-red-500 font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Color:</span>
                    <span>{selectedColor}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.colors.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => handleColorSelect(variant.name)}
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
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
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
                        onClick={() => handleSizeSelect(size)}
                        className={`py-2 border ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
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

              {/* Store Pickup */}
              <div className="border-t pt-6 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Pickup available at Saint Clair Avenue West</p>
                    <p className="text-gray-600 text-sm">Usually ready in 24 hours</p>
                    <button className="text-gray-600 text-sm underline mt-1">View store information</button>
                  </div>
                </div>
              </div>

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
                <AccordionItem value="reviews">
                    <AccordionTrigger>Reviews</AccordionTrigger>
                      <AccordionContent>
                        <ProductReviews productId={product.id.toString()} />
                      </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <RecommendedProducts productId={product.id} category={product.category} />
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