import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/store/slices/productSlice";
import CategoryList from "./CategoriesList";
import ProductGrid from "./ProductGrid";
import { FiSearch } from "react-icons/fi";

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
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [products, debouncedSearch]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <PromotionalBanner />
      <div className="container mx-auto px-4 py-6">
        <div className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
          />
          <FiSearch className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CategoryList />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-blue-600 font-semibold">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
