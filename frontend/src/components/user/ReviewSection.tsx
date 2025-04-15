import React from "react";
import { Review } from "@/store/slices/productSlice";
import ReviewForm from "./ReviewForm";


interface ReviewsSectionProps {
  productId: string;
  reviews: Review[];
  isLoggedIn: boolean;
  onSubmitReview: (data: { rating: number; comment: string }) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId, reviews, isLoggedIn, onSubmitReview }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <span className="font-bold">{review.name}</span>
                <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center my-2">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span>{review.rating}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      {isLoggedIn && (
        <ReviewForm productId={productId} onSubmit={onSubmitReview} />
      )}
    </div>
  );
};

export default ReviewsSection;
