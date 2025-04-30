/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/store/store";
import { Product, submitReview } from "@/store/slices/productSlice";
import ProductInfo from "./ProductInfo";
import ActionsBar from "./ActionBar";
import ReviewsSection from "./ReviewSection";

interface ProductImagesProps {
  images: string[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const imageUrl = images[0].startsWith("http")
    ? images[0]
    : `${backendUrl}${images[0]}`;
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Product Image"
        className="w-full h-96 object-cover rounded-lg cursor-zoom-in transition-transform duration-300 hover:scale-105 shadow-lg"
        loading="lazy"
      />
    </div>
  );
};

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const tokenFromStore = useSelector((state: RootState) => state.auth.token);
  const token = tokenFromStore || localStorage.getItem("token");

  const [reviews, setReviews] = useState(product.reviews);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleReviewSubmitted = async (data: { rating: number; comment: string }) => {
    setReviewError(null);
    if (!token) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const result = await dispatch(
        submitReview({ productId: product._id, rating: data.rating, comment: data.comment })
      ).unwrap();
      setReviews((prevReviews) => [result.review, ...prevReviews]);
      router.reload();
    } catch{
      router.reload();
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages images={[product.image]} />
        <div className="flex flex-col justify-between">
          <ProductInfo product={product} />
          <ActionsBar product={product} />
        </div>
      </div>
      <div className="mt-10">
        {reviewError && (
          <div className="mb-4 p-4 border rounded text-red-600 bg-red-50">
            {reviewError}
          </div>
        )}
        <ReviewsSection
          productId={product._id}
          reviews={reviews}
          isLoggedIn={true} 
          onSubmitReview={handleReviewSubmitted}
        />
        {isSubmittingReview && (
          <div className="mt-4 text-center">
            <span className="text-gray-600 font-medium">Submitting your review...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
