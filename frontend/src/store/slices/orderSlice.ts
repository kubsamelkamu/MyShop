import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentResult?: {
    id?: string;
    status?: string;
    update_time?: string;
  };
  totalPrice: number;
  orderStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createOrder = createAsyncThunk<Order, Order>(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/orders`, orderData, getAuthHeader());
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Create order failed');
      }
      return rejectWithValue('Create order failed');
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, string>(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/orders/${orderId}`, getAuthHeader());
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Create order failed');
      }
      return rejectWithValue('Create order failed');
    }
  }
);

export const fetchUserOrders = createAsyncThunk<Order[], void>(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/orders/myorders`, getAuthHeader());
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Create order failed');
      }
      return rejectWithValue('Create order failed');
    }
  }
);

export const fetchAllOrders = createAsyncThunk<Order[], void>(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/orders`, getAuthHeader());
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Create order failed');
      }
      return rejectWithValue('Create order failed');
    }
  }
);

export const deleteOrder = createAsyncThunk<string, string>(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/orders/${orderId}`, getAuthHeader());
      return orderId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Delete order failed');
      }
      return rejectWithValue('Delete order failed');
    }
  }
);

export const updateOrderStatus = createAsyncThunk<Order, { orderId: string; orderStatus: string }>(
  'orders/updateOrderStatus',
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/orders/${orderId}/status`,
        { orderStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Delete order failed');
      }
      return rejectWithValue('Delete order failed');
    }
  }
);

export const payOrder = createAsyncThunk<Order, { orderId: string; paymentResult: { id: string; status: string; update_time: string } }>(
  'orders/payOrder',
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/orders/${orderId}/pay`,
        paymentResult,
        getAuthHeader()
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Payment update failed');
      }
      return rejectWithValue('Payment update failed');
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.orderDetails && state.orderDetails._id === action.payload._id) {
          state.orderDetails = action.payload;
        }
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
