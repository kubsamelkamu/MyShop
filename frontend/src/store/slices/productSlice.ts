import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import axios from "axios";

export interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  title: string | undefined;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  image: string;
  user: string;
  reviews: Review[];
  numReviews: number;
  rating: number;
  createdAt: string;
}

interface ProductState {
  products: Product[];
  productDetails: Product | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
};

export const fetchProducts = createAsyncThunk<
  {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  },
  { page: number; limit: number },
  { rejectValue: string }
>("products/fetchProducts", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error))
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    return rejectWithValue("Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error))
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    return rejectWithValue("Failed to fetch product details");
  }
});

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || "Failed to create product");
      return rejectWithValue("Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { id: string; data: Partial<Product> }>(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || "Failed to update product");
      return rejectWithValue("Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
      return rejectWithValue("Failed to delete product");
    }
  }
);


export const submitReview = createAsyncThunk<
  { message: string; review: Review },
  { productId: string; rating: number; comment: string },
  { rejectValue: string }
>("products/submitReview", async ({ productId, rating, comment }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
      { rating, comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error))
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    return rejectWithValue("Failed to submit review");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetails(state) {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            currentPage: number;
            totalPages: number;
            totalProducts: number;
          }>
        ) => {
          state.loading = false;
          state.products = action.payload.products;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalProducts = action.payload.totalProducts;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
 
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetails = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products = state.products.map((prod) =>
          prod._id === action.payload._id ? action.payload : prod
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
 
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter((prod) => prod._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

.addCase(submitReview.fulfilled, (state, action) => {
  if (state.productDetails) {
    const newReview = {
      ...action.payload.review,
      rating: action.payload.review.rating || 0,
    };


    state.productDetails.reviews = state.productDetails.reviews || [];
    state.productDetails.reviews.unshift(newReview);
    state.productDetails.numReviews = state.productDetails.reviews.length;
    state.productDetails.rating =
      state.productDetails.reviews.reduce((acc, rev) => (rev.rating || 0) + acc, 0) /
      state.productDetails.reviews.length;
  }
});

  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
