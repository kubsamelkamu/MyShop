/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import UserLayout from "@/components/user/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addToCart, CartItem as CartSliceItem } from "@/store/slices/cartSlice";
import {
  fetchWishlist,
  removeFromWishlist,
  WishlistItem,
} from "@/store/slices/wishListSlice";
import { Product } from "@/store/slices/productSlice";
import { toast } from "react-toastify";

const getImageUrl = (image?: string): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!image) return "/fallback.jpg";
  return image.startsWith("http") ? image : `${backendUrl}${image}`;
};

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items: wishItems, loading, error } = useSelector(
    (state: RootState) => state.wishlist
  );

  const cartItems = useSelector(
    (state: RootState) => state.cart.items as CartSliceItem[]
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = async (wishItem: WishlistItem) => {
    const prod = wishItem.product;
    const existing = cartItems.find(
      (ci) => ci.product._id === prod._id
    );
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + 1 > prod.countInStock) {
      toast.error("Cannot add more than available stock");
      return;
    }

    try {
      const result = await dispatch(
        addToCart({ product: prod._id, quantity: 1, price: prod.price })
      );
      if (addToCart.fulfilled.match(result)) {
        await dispatch(removeFromWishlist(prod._id));
        toast.success("Item moved to cart");
      } else {
        toast.error("Failed to move item to cart");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-32 w-32 border-t-4 border-blue-500 rounded-full" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="text-center text-red-500 py-20">{error}</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="wishlist-page container mx-auto px-4 py-6 mt-20">
        <h1 className="text-3xl text-blue-700 font-bold mb-8 text-center">
          Your Wishlist
        </h1>
        {wishItems.length === 0 ? (
          <div className="text-center text-xl text-gray-500">
            <p>Your wishlist is empty.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-4">
            {wishItems.map((wishItem) => {
              const prod = wishItem.product as Product;
              if (!prod) return null;
              return (
                <div
                  key={prod._id}
                  className="wishlist-item bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                >
                  <img
                    src={getImageUrl(prod.image)}
                    alt={prod.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                  <h3 className="text-xl text-blue-700 font-semibold mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{prod.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      ${prod.price.toFixed(2)}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleMoveToCart(wishItem)}
                        className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(prod._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default WishlistPage;
