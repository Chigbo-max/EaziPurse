import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.token = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setError,
  setLoading,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading; 