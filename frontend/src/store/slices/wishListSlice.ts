import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "./productSlice"; 

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface WishlistItem {
  product: Product; 
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const addToWishlist = createAsyncThunk<WishlistItem, { productId: string }>(
  "wishlist/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/wishlist`,
        { product: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const addedItem = response.data.items?.slice(-1)[0]; 
      return addedItem;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || "Failed to add to wishlist");
      }
      return rejectWithValue("Failed to add to wishlist");
    }
  }
);

export const fetchWishlist = createAsyncThunk<WishlistItem[]>(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${apiUrl}/wishlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.items; 
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
      return rejectWithValue("Failed to fetch wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk<string, string>(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${apiUrl}/wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return productId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
      return rejectWithValue("Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: builder => builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(fetchWishlist.pending, state => { state.loading = true; state.error = null; })
    .addCase(fetchWishlist.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.items = payload;
    })
    .addCase(fetchWishlist.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    })
    .addCase(removeFromWishlist.pending, state => { state.loading = true; })
    .addCase(removeFromWishlist.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.items = state.items.filter(i => i.product._id !== payload);
    })
    .addCase(removeFromWishlist.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    })
});

export default wishlistSlice.reducer;






