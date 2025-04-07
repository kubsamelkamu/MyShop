import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Product } from "@/components/admin/ProductTable";

const apiurl = process.env.NEXT_PUBLIC_API_URL

interface ProductFormInputs {
  name: string;
  description: string;
  price: number;
  stock: number;
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>({
    defaultValues: product || {},
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    reset(product || {});
  }, [product, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await fetch(`${apiurl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
  
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Upload error:", error.message);
      } else {
        console.error("An unknown error occurred during upload.");
      }
      return null;
    }
  };
  

  const onFormSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    if (selectedFile) {
      try {
        setUploading(true);
        const imageUrl = await uploadImage(selectedFile);
        if (imageUrl) {
          setValue("image", imageUrl, { shouldValidate: true });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Upload error:", error.message);
        } else {
          console.error("An unknown error occurred during upload.");
        }
      } finally {
        setUploading(false);
      }
    }
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
        <label className="block text-gray-700">Product Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          onChange={handleFileChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <input type="hidden" {...register("image", { required: "Image URL is required" })} />
      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting || uploading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm; 