import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Product } from "@/components/admin/ProductTable";

interface ProductFormInputs {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  image: string;
}

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormInputs) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormInputs>({
    defaultValues: product || {},
  });

  useEffect(() => {
    reset(product || {});
  }, [product, reset]);

  const onFormSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Product Name"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Product Description"
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Price is required" })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Price"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Stock</label>
          <input
            type="number"
            {...register("countInStock", { required: "Stock is required" })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Stock"
          />
          {errors.countInStock && <p className="text-red-500 text-xs">{errors.countInStock.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Category"
          />
          {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-gray-700">Brand</label>
          <input
            type="text"
            {...register("brand", { required: "Brand is required" })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Brand"
          />
          {errors.brand && <p className="text-red-500 text-xs">{errors.brand.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Image URL</label>
        <input
          type="file"
          {...register("image", { required: "Image URL is required" })}
          className="w-full border px-3 py-2 rounded"
          placeholder="Image URL"
        />
        {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
