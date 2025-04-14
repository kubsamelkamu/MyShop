import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<Product> = ({ _id, name, price, image }) => {
  const [imgError, setImgError] = useState(false);

  const imageUrl = image.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`;
  const finalImage = imgError ? "/fallback.jpg" : imageUrl;

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      <Link href={`/products/${_id}`} legacyBehavior>
        <a className="group relative block">
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={finalImage}
              alt={name}
              layout="fill"
              objectFit="cover"
              onError={() => setImgError(true)}
              unoptimized={true}
              className="rounded-t-lg group-hover:scale-110 transition-transform duration-300"
            />

            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-lg font-medium transition-opacity duration-300">
                View Product
              </span>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
            <p className="mt-2 text-blue-600 font-bold">${price.toFixed(2)}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products}) => {

  if (!products.length) {
    return (
      <p className="text-red-500 text-center text-lg">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          _id={product._id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
