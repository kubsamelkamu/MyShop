import React from "react";
import { Review } from "@/store/slices/productSlice";
import ReviewForm from "./ReviewForm";

interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  isLoggedIn: boolean;
  onSubmitReview: (data: { rating: number; comment: string }) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  reviews,
  isLoggedIn,
  onSubmitReview,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, idx) => {
          const starNumber = idx + 1;
          return (
            <span
              key={idx}
              className={`text-2xl transition-colors duration-200 ${
                starNumber <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{review.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center mb-3">
                {renderStars(review.rating)}
                <span className="ml-3 text-gray-700 font-medium">
                  {review.rating}/5
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      {isLoggedIn && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Write a Review</h4>
          <ReviewForm productId={productId} onSubmit={onSubmitReview} />
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
