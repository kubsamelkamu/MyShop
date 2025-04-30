import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { FiSearch } from "react-icons/fi";
import CategoryList from "./CategoriesList";
import ProductGrid from "./ProductGrid";

const PromotionalBanner = () => {
  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/banner5.jpg')" }}
    ></div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, totalPages, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 8 }));
  }, [dispatch, page]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div>
      <PromotionalBanner />
      <div className="container mx-auto px-4 py-6">
        <div className="relative mb-6">
          <FiSearch className="absolute top-3.5 left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full border border-gray-300 px-10 py-3 rounded-lg shadow-sm 
                       transition-all duration-300 ease-in-out 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       hover:border-blue-400"
            aria-label="Search products"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <CategoryList />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}

        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
