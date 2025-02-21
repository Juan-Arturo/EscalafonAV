import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir la estructura del estado de autenticación
interface AuthState {

  user: {
    id: number;
    name: string;
    email: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginReducer: (state, action: PayloadAction<{ user: AuthState['user'] }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logoutReducer: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginReducer, logoutReducer } = authSlice.actions;
export default authSlice.reducer;
