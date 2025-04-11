/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<Product> = ({ _id, name, price, image }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/products/${_id}`}>
        <>
            <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800">{name}</h3>
            <p className="mt-2 text-blue-600 font-bold">${price.toFixed(2)}</p>
           </div>
        </>
      </Link>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (!products.length) {
    return <p className='text-red-500 text-center text-lg'>No products found.</p>;
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
