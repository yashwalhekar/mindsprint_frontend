import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }),
  tagTypes: ["Customer","Modules","Lessons"],
  endpoints: (builder) => ({
    getCourse: builder.query({
      query: () => ({
        url: "/course",
        method: "GET",
      }),

      providesTags: ["Customer"],
    }),

    getModules: builder.query({
      query: (course_id) => ({
        url: `/course/${course_id}/modules`,
        method: "GET",
      }),
      providesTags: ["Modules"],
    }),
    getLessons: builder.query({
      query: ({ course_id, module_id }) => ({
        url: `/course/${course_id}/modules/${module_id}/lessons`,
        method: "GET",
      }),
      providesTags: ["Lessons"],
    }),
  }),
});

export const { useGetCourseQuery,useGetModulesQuery,useGetLessonsQuery } = courseApi;
