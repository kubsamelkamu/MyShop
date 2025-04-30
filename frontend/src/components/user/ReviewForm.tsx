import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

interface ReviewFormInputs {
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: ReviewFormInputs) => void;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange(star);
          }}
          role="button"
          tabIndex={0}
          className={`cursor-pointer text-2xl transition-colors ${
            star <= value ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInputs>();

  const onFormSubmit: SubmitHandler<ReviewFormInputs> = async (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 border p-4 rounded shadow">      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating</label>
        <Controller
          name="rating"
          control={control}
          rules={{ required: "Rating is required" }}
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <StarRating value={value} onChange={onChange} />
          )}
        />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Comment</label>
        <textarea
          {...register("comment", { required: "Comment is required" })}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Write your review..."
        ></textarea>
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
