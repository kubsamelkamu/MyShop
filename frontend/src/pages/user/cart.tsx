/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import UserLayout from "@/components/user/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  CartItem,
} from "@/store/slices/cartSlice";
import { Product } from "@/store/slices/productSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const getImageUrl = (image?: string): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!image) return "/fallback.jpg";
  return image.startsWith("http") ? image : `${backendUrl}${image}`;
};

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleDecrease = (prodId: string, qty: number) => {
    if (qty <= 1) return;
    dispatch(updateCartItem({ productId: prodId, quantity: qty - 1 }));
  };

  const handleIncrease = (prodId: string, qty: number, stock: number) => {
    if (qty + 1 > stock) {
      toast.error("Cannot add more than available stock");
      return;
    }
    dispatch(updateCartItem({ productId: prodId, quantity: qty + 1 }));
  };

  const handleRemove = (prodId: string) => {
    dispatch(removeFromCart(prodId));
  };

  const totalItems = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.price || 0)), 0);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full" />
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
              {items.map((item: CartItem, index: number) => {
                if (!item || !item.product) return null;

                const prod = item.product as Product;

                return (
                  <div
                    key={prod._id || index}
                    className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
                  >
                    <img
                      src={getImageUrl(prod.image)}
                      alt={prod.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <a
                        href={`/user/products/${prod._id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {prod.name}
                      </a>
                      <p className="text-gray-600">${prod.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrease(prod._id, item.quantity)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        –
                      </button>
                      <span className="px-3 py-1 border rounded">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(prod._id, item.quantity, prod.countInStock)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className="font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(prod._id)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-lg shadow lg:sticky lg:top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <p className="mb-2">
                Items: <span className="font-medium">{totalItems}</span>
              </p>
              <p className="mb-4">
                Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span>
              </p>
              <button
                disabled={items.length === 0}
                onClick={() => router.push("/user/checkout")}
                className="w-full bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default CartPage;
