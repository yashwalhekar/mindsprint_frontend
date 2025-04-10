// src/features/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),  // Base URL
  tagTypes:["Enrollment"],
  endpoints: (builder) => ({
    // Enroll User API
    enrollUser: builder.mutation({
      query: ({ user_id, course_id }) => ({
        url: "/enroll",  // API endpoint
        method: "POST",
        body: { user_id, course_id },
      }),
   invalidatesTags:["Enrollment"]
    }),
    getEnrollmentInfoApi: builder.query({
      query: () => ({
        url: "/allEnrollments",
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("🧠 transformResponse:", response); // ← Add this to test
        return response.data;
      },
      
      providesTags: ["Enrollment"],
    }),
  }),
});

export const { useEnrollUserMutation ,useGetEnrollmentInfoApiQuery} = enrollmentApi;
