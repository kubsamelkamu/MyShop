/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "./productSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface CartItem {
  product: Product;  
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<CartItem[], void>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${apiUrl}/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.items as CartItem[];
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to fetch cart");
      }
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk<CartItem, { product: string; quantity: number; price: number }>(
  "cart/addToCart",
  async ({ product, quantity, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token provided");

      const response = await axios.post(
        `${apiUrl}/cart`,
        { product, quantity, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const added = response.data.items.find((i: any) => i.product._id === product);
      return added as CartItem;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to add to cart");
      }
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk<
  { productId: string; quantity: number },
  { productId: string; quantity: number }
>(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { productId, quantity };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to update cart item"
        );
      }
      return rejectWithValue(error.message || "Failed to update cart item");
    }
  }
);

export const removeFromCart = createAsyncThunk<string, string>(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${apiUrl}/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return productId;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to remove from cart");
      }
      return rejectWithValue("Failed to remove from cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (i) => i.product._id === action.payload.product._id
        );
        if (idx >= 0) {
          state.items[idx].quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
          state.loading = false;
          const idx = state.items.findIndex(
            (i) => i.product._id === action.payload.productId
          );
          if (idx >= 0) {
            state.items[idx].quantity = action.payload.quantity;
          }
        }
      )
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(
          (i) => i.product._id !== action.payload
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
