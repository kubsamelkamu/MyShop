/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Product } from "@/store/slices/productSlice";
import ProductInfo from "./ProductInfo";
import ActionsBar from "./ActionBar";
import ReviewsSection from "./ReviewSection";

interface ProductImagesProps {
  images: string[];
}

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
        className="w-full h-96 object-cover rounded-lg cursor-zoom-in transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  return (
    <div className="container mt-18 mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages images={[product.image]} />
        <div>
          <ProductInfo product={product} />
          <ActionsBar productId={product._id} />
        </div>

      <div className="mt-10">
        <ReviewsSection productId={product._id} reviews={product.reviews} isLoggedIn={true} 
          onSubmitReview={(data) => {
            console.log("Review submitted for product", product._id, data);
          }}
        />
      </div>
    </div>
   </div>
  );
};

export default ProductDetailPage;
