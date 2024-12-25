import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3030/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: (builder) => ({
    userInfo: builder.query({
      query: (id) => `users/${id}`,
    }),
    userExperiences: builder.query({
      query: () => `experiences`,
    }),
    getJobsForApplicant: builder.query({
      query: (id) => `applicants?userId=${id}`,
      providesTags: ['Applicants'],
    }),
    getApplicantsForAJob: builder.query({
      query: (id) => `applicants?jobId=${id}`,
      providesTags: ['Applicants'],
    }),
    userApply: builder.mutation({
      query(body) {
        return {
          url: `applicants`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Applicants'],
    }),
    deleteApply: builder.mutation({
      query: (id) => ({ url: `applicants?jobId=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Applicants'],
    }),
    addExperience: builder.mutation({
      query(body) {
        return {
          url: `experiences`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Experiences'],
    }),
    updateExperience: builder.mutation({
      query({ id, ...patch }) {
        return {
          url: `experiences/${id}`,
          method: 'PATCH',
          body: patch,
        };
      },
      invalidatesTags: ['Experiences'],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({ url: `experiences/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Experiences'],
    }),
  }),
});

export const {
  useUserInfoQuery,
  useUserExperiencesQuery,
  useUserApplyMutation,
  useGetJobsForApplicantQuery,
  useGetApplicantsForAJobQuery,
  useDeleteApplyMutation,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceMutation,
} = userApi;
