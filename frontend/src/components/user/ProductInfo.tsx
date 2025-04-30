import React from "react";
import { Product } from "@/store/slices/productSlice";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800">{product.name}</h2>
      <p className="mt-2 text-xl text-blue-600 font-bold">${product.price.toFixed(2)}</p>
      <p className="mt-4 text-gray-700">{product.description}</p>
      <p className="mt-4">
        <span className="font-medium">Category:</span> {product.category}
      </p>
      <p className="mt-2">
        <span className="font-medium">Brand:</span> {product.brand}
      </p>
      <p className="mt-2">
        <span className="font-medium">In Stock:</span> {product.countInStock}
      </p>
      <p className="mt-2">
        <span className="font-medium">Average Rating:</span> {product.rating.toFixed(1)} ({product.numReviews} reviews)
      </p>
    </div>
  );
};

export default ProductInfo;
