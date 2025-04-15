import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ReviewFormInputs {
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: ReviewFormInputs) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInputs>();

  const onFormSubmit: SubmitHandler<ReviewFormInputs> = async (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 border p-4 rounded">
      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Rating (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          {...register("rating", { required: "Rating is required", valueAsNumber: true })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Comment</label>
        <textarea
          {...register("comment", { required: "Comment is required" })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Write your review..."
        ></textarea>
        {errors.comment && <p className="text-red-500 text-xs">{errors.comment.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
