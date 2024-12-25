import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { jobApi } from './api/jobApiSlice';
import { userApi } from './api/userApiSlice';
import { authApi } from './api/authApiSlice';
import { authSlice } from './authSlice';

export const store = configureStore({
  reducer: {
    [jobApi.reducerPath]: jobApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authSlice.name]: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(jobApi.middleware)
      .concat(userApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);
