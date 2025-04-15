import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductById } from "@/store/slices/productSlice";
import UserLayout from "@/components/user/UserLayout";
import ProductDetailPage from "@/components/user/ProductDetail";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const { productDetails, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p className="text-center my-10">Loading product...</p>;
  if (error) return <p className="text-red-500 text-center my-10">{error}</p>;

  return productDetails ? (
    <UserLayout>
      <ProductDetailPage product={productDetails} />
    </UserLayout>
  ) : (
    <p className="text-center my-10">Product not found</p>
  );
};

export default ProductDetail;
