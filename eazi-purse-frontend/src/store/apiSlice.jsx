import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get token from localStorage
const getToken = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('authorization', token);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Profile', 'Wallet', 'Transaction'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/jwt/create/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Wallet'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/users/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User', 'Wallet'],
    }),
    
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: '/user/jwt/refresh/',
        method: 'POST',
        body: { refresh },
      }),
    }),
    
    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/user/users/me/',
      providesTags: ['User'],
    }),
    
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/users/me/',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Profile endpoints
    getProfile: builder.query({
      query: () => '/user/profile/',
      providesTags: ['Profile'],
    }),
    
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/user/profile/',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    createProfile: builder.mutation({
      query: (profileData) => ({
        url: '/user/profile/',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    // Dashboard endpoint
    getDashboard: builder.query({
      query: () => '/user/dashboard/',
      providesTags: ['User', 'Wallet'],
    }),
    
    // Wallet endpoints
    fundWallet: builder.mutation({
      query: (data) => ({
        url: '/wallet/fund/account',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'Transaction'],
    }),
    
    verifyFund: builder.mutation({
      query: (data) => ({
        url: `/wallet/fund/verify?reference=${data.reference}`,
        method: 'GET',
      }),
      invalidatesTags: ['Wallet', 'Transaction'],
    }),
    
    transferFund: builder.mutation({
      query: (transferData) => ({
        url: '/wallet/fund/transfer',
        method: 'POST',
        body: transferData,
      }),
      invalidatesTags: ['Wallet', 'Transaction'],
    }),
    
    // Transaction endpoints
    getTransactions: builder.query({
      query: () => '/wallet/transactions/',
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreateProfileMutation,
  useGetDashboardQuery,
  useFundWalletMutation,
  useVerifyFundMutation,
  useTransferFundMutation,
  useGetTransactionsQuery,
} = apiSlice; 