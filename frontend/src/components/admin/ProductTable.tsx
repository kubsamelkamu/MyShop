import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  image : string;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Brand</th>
            <th className="py-2 px-4 text-left">Stock</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">${product.price}</td>
              <td className="py-2 px-4">{product.category}</td>
              <td className="py-2 px-4">{product.brand}</td>
              <td className="py-2 px-4">{product.countInStock}</td>
              <td className="py-2 px-4 text-center flex justify-center gap-2">
                <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700">
                  <FiEdit />
                </button>
                <button onClick={() => onDelete(product._id)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
