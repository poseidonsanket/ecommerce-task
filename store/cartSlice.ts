import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  totalItems: number; // Total number of items in the cart
}

const initialState: CartState = {
  totalItems: 0, // Initially, no items in the cart
};

const totalCartItemsSlice = createSlice({
  name: 'totalCartItems',
  initialState,
  reducers: {
    setTotalItems(state, action: PayloadAction<number>) {
      state.totalItems = action.payload; // Set total item count directly
    },
    incrementItemCount(state) {
      state.totalItems += 1; // Increment total items by 1
    },
    decrementItemCount(state) {
      if (state.totalItems > 0) {
        state.totalItems -= 1; // Decrement total items by 1, ensuring it doesn't go below 0
      }
    },
    clearCart(state) {
      state.totalItems = 0; // Reset total items to 0 when the cart is cleared
    },
  },
});

export const { setTotalItems, incrementItemCount, decrementItemCount, clearCart } = totalCartItemsSlice.actions;
export default totalCartItemsSlice.reducer;
