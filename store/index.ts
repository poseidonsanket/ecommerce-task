// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import totalCartItemsReducer  from './cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    totalCartItems : totalCartItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
