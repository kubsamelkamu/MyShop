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

  if (loading) return(
    <UserLayout>
        <p className="text-center my-10">Loading product...</p>;
    </UserLayout>
  );

  if (error) return(
    <UserLayout>
         <p className="text-red-500 text-center my-10">{error}</p>;
    </UserLayout>
  );


  return productDetails ? (
    <UserLayout>
      <ProductDetailPage product={productDetails} />
    </UserLayout>
  ) : (
    <UserLayout>
      <p className="text-2xl text-blue-600">Product not found.</p>
    </UserLayout>
  );
};

export default ProductDetail;
