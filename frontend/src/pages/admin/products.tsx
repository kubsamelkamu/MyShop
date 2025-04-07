import React, { useEffect, useState } from "react";
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
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
        <button
          type="button"
          onClick={handleAdd}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />

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
