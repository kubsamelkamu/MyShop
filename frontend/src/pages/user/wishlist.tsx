/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import UserLayout from "@/components/user/UserLayout";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchWishlist, removeFromWishlist } from "@/store/slices/wishListSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const getImageUrl = (image: string | undefined): string => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    if (!image) return "/fallback.jpg"; 
    return image.startsWith("http") ? image : `${backendUrl}${image}`;
  };
  

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = async (item: any) => {
    try {
      const result = await dispatch(
        addToCart({
          product: item.product._id,
          quantity: 1,
          price: item.product.price,
        })
      );
  
      if (addToCart.fulfilled.match(result)) {
        await dispatch(removeFromWishlist(item.product._id));
        toast.success("Item moved to cart");
      } else {
        toast.error("Failed to move item to cart");
      }
    } catch{
      toast.error("Something went wrong");
    }
  };
  
  
  if (loading) {
    return (
     <UserLayout>
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin mt-10 rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        </div>
     </UserLayout>
    );
  }

  if (error) {
    return(
      <UserLayout>
          <div className="text-center text-red-500">{error}</div>;
      </UserLayout>
    ) 
  }

  return (
    <UserLayout>
        <div className="wishlist-page container mx-auto px-4 py-6 mt-20">
            <h1 className="text-3xl text-blue-700 font-bold mb-8 text-center">Your Wishlist</h1>
            {items.length === 0 ? (
            <div className="text-center text-xl text-gray-500">
            <p>Your wishlist is empty.</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition">
                Browse Products
            </button>
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
                const imageUrl = getImageUrl(item.product.image);
                return (
                <div
                    key={item.product._id}
                    className="wishlist-item bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                >
                    <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    loading="lazy"
                    />
                    <h3 className="text-xl text-blue-700 font-semibold mb-2">{item.product.name}</h3>
                    <p className="text-gray-600 mb-2">{item.product.description}</p>
                    <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">${item.product.price}</span>
                    <div className="space-x-2">
                        <button
                        onClick={() => handleMoveToCart(item)} 
                        className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 transition"
                        >
                        Move to Cart
                        </button>

                        <button
                        onClick={() => handleRemove(item.product._id)}
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
