import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // Adjust based on your state structure
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Customer", "Modules", "Lessons", "Notes","Quiz"], // Moved this outside prepareHeaders
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

    addUserNotesApi: builder.mutation({
      query: ({ course_id, module_id, lesson_id, notes }) => ({
        url: `/course/${course_id}/modules/${module_id}/lessons/${lesson_id}/usernotes`,
        method: "POST",
        body: notes,
      }),
      invalidatesTags: ["Notes"],
    }),

    getUserNotesApi:builder.query({
      query:({course_id,module_id,lesson_id,user_id})=>({
        url:`/course/${course_id}/modules/${module_id}/lessons/${lesson_id}/viewnotes?user_id=${user_id}`,
        method:"GET"
      }),
      providesTags:["Notes"]
    }),

    getQuizApi:builder.query({
      query:({course_id,module_id,lesson_id})=>({
        url:`/${course_id}/${module_id}/${lesson_id}`,
        method:"GET"
      }),
      providesTags:["Quiz"]
    }),

    submitAnswersApi: builder.mutation({
  query: ({ userId, quizId, answers }) => ({
    url: `/submit`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      userId,
      quizId,
      answers,
    },
  }),
  invalidatesTags: ["Quiz"],
})

  }),
});

export const { 
  useGetCourseQuery, 
  useGetModulesQuery, 
  useGetLessonsQuery, 
  useAddUserNotesApiMutation, // Added missing mutation export
  useGetUserNotesApiQuery,
  useGetQuizApiQuery,
  useSubmitAnswersApiMutation

} = courseApi;
