import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductTable, { Product } from "@/components/admin/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/store/slices/productSlice";
import Modal from "@/components/admin/Modal";
import ProductForm from "@/components/admin/ProductForm";
import { toast } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, totalPages, loading, error } = useSelector((state: RootState) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5; 

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    dispatch(deleteProduct(productId))
      .unwrap()
      .then(() => {
        toast.success("Product deleted successfully!");
        dispatch(fetchProducts({ page, limit: pageSize }));
      })
      .catch((err) => {
        toast.error("Failed to delete product: " + err);
      });
  };

  const handleFormSubmit = (data: Partial<Product>) => {
    if (selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct._id, data }))
        .unwrap()
        .then(() => {
          toast.success("Product updated successfully!");
          dispatch(fetchProducts({ page, limit: pageSize }));
          setIsModalOpen(false);
        })
        .catch((err) => {
          toast.error("Failed to update product: " + err);
        });
    } else {
      dispatch(createProduct(data))
        .unwrap()
        .then(() => {
          toast.success("Product added successfully!");
          dispatch(fetchProducts({ page, limit: pageSize }));
          setIsModalOpen(false);
        })
        .catch((err) => {
          toast.error("Failed to add product: " + err);
        });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <button
            type="button"
            onClick={handleAdd}
            className="mb-4 md:mb-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ProductTable products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1 border-t border-b">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ProductForm
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Products;
