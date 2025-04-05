import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import wishlistReducer from './slices/wishListSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: orderReducer,
  products: productReducer,
  users: userReducer, 
  wishlist: wishlistReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};



const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
