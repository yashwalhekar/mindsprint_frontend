// src/features/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),  // Base URL
  endpoints: (builder) => ({
    // Enroll User API
    enrollUser: builder.mutation({
      query: ({ user_id, course_id }) => ({
        url: "/enroll",  // API endpoint
        method: "POST",
        body: { user_id, course_id },
      }),
    }),
  }),
});

export const { useEnrollUserMutation } = enrollmentApi;
