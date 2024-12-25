import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3030/',
});
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query(body) {
        return {
          url: `authentication`,
          method: 'POST',
          body,
        };
      },
    }),
    register: builder.mutation({
      query(body) {
        return {
          url: `users`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
