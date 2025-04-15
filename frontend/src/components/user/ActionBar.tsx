import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist } from "@/store/slices/wishListSlice";
import { Product } from "@/store/slices/productSlice";

interface ActionsBarProps {
  product: Product;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ product }) => {

  const dispatch = useDispatch<AppDispatch>();
  const tokenFromStore = useSelector((state: RootState) => state.auth.token);
  const token = tokenFromStore || localStorage.getItem("token");

  const[message,setMessage] = useState('');
  
  const handleAddToCart = () => {
    if (!token) {
      return;
    }

    const cartItem = {
      product: product._id,
      quantity: 1,
      price: product.price,
    };

    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => {
        setMessage('Product added to cart!');
      })
      .catch(() => {
        setMessage('Failed to add product to cart');
        return;
      });
  };

  const handleAddToWishlist = () => {
    if (!token) {
      return;
    }
  
    const wishlistItem = {
      productId: product._id,
    };
  
    dispatch(addToWishlist(wishlistItem))
      .unwrap()
      .then(() => { 
        setMessage('Product added to wishlist!');
        return;
      })
      .catch(() => {
        setMessage('Product already in wishlist');
        return;
      });
  };
  
  return (
    <div className="mt-6 flex flex-col items-start space-y-2">
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
        >
          Add to Wishlist
        </button>
      </div>
      
      {message && (
        <p className="text-green-600 text-sm mt-1">{message}</p>
      )}
    </div>
  );
  
};

export default ActionsBar;
