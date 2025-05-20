// src/features/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/auth" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
     
      
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getProfile:builder.mutation({
      query:(id)=>({
        url:`/profile/${id}`,
        method:"GET",
        body:id
      })
    }),

    logoutApi:builder.mutation({
      query:(token)=>({
        url:`/logout`,
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    })
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation,useGetProfileMutation ,useLogoutApiMutation} = authApi;
