import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const getToken = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
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
    
    getAdminTransactions: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.filter) searchParams.append('filter', params.filter);
        if (params?.search) searchParams.append('search', params.search);
        return `/wallet/admin/transactions/?${searchParams.toString()}`;
      },
      providesTags: ['AdminTransactions'],
    }),
    

    
    // Change password endpoint
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/user/change-password/',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
    // Login history endpoint
    getLoginHistory: builder.query({
      query: () => '/user/login-history/',
      providesTags: ['LoginHistory'],
    }),
    
    // Admin endpoints
    getAdminDashboard: builder.query({
      query: () => '/user/admin/dashboard/',
      providesTags: ['Admin'],
    }),
    
    getAdminUsers: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        return `/user/admin/users/?${searchParams.toString()}`;
      },
      providesTags: ['AdminUsers'],
    }),
    
    updateAdminUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/admin/users/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    
    getAdminSettings: builder.query({
      query: () => '/user/admin/settings/',
      providesTags: ['AdminSettings'],
    }),
    
    updateAdminSettings: builder.mutation({
      query: (settings) => ({
        url: '/user/admin/settings/',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['AdminSettings'],
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
  useChangePasswordMutation,
  useGetLoginHistoryQuery,
  useFundWalletMutation,
  useVerifyFundMutation,
  useTransferFundMutation,
  useGetTransactionsQuery,
  // Admin hooks
  useGetAdminDashboardQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = apiSlice; 