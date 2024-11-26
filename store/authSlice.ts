// store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for the Auth state
interface AuthState {
  isLogin: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isLogin: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to log in, storing the token in the state
    login(state, action: PayloadAction<{ token: string }>) {
      state.isLogin = true;
      state.token = action.payload.token;
    },
    // Action to log out, clearing the token
    logout(state) {
      state.isLogin = false;
      state.token = null;
    },
  },
});

// Export actions
export const { login, logout } = authSlice.actions;
// Export the reducer to be included in the store
export default authSlice.reducer;
