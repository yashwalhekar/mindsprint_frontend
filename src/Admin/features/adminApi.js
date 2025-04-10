import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/admin",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AdminUsers", "Courses", "Modules", "Lessons","Notes"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["AdminUsers"],
    }),

    getAllAdminUsers: builder.query({
      query: () => "/adminUsers",
      providesTags: ["AdminUsers"],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "/getCourses",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["Courses"],
    }),

    addNewUser: builder.mutation({
      query: (userData) => ({
        url: "/addUser",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: "/update-role",
        method: "PUT",
        body: { id, role },
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    addNewCourse: builder.mutation({
      query: (course) => ({
        url: "/addCourse",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ user_id, status }) => ({
        url: `/update-status`,
        method: "PATCH",
        body: { user_id, is_active: status },
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    updateCourseStatusApi: builder.mutation({
      query: ({ course_id, status }) => {
        console.log("API Call - ID:", course_id, "Status:", status);  // Debugging log
    
        return {
          url: `/update-course`,
          method: "PATCH",
          body: { course_id, status },  // Ensure these values are not undefined
        };
      },
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getCourseById: builder.query({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),

    //________________________ MODULES ________________________

    getAllModules: builder.query({
      query: (course_id) => ({
        url: `/course/${course_id}/module`,
        method: "GET",
      }),
      providesTags: ["Modules"],
    }),

    addModule: builder.mutation({
      query: ({ title, course_id, position }) => ({
        url: `/course/${course_id}/module`,
        method: "POST",
        body: { title, position },
      }),
      invalidatesTags: ["Modules"],
    }),

    deleteModule: builder.mutation({
      query: ({ course_id, module_id }) => ({
        url: `/course/${course_id}/module/${module_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Modules"],
    }),

    //________________________ LESSONS ________________________

    getAllLessons: builder.query({
      query: ({ course_id, module_id }) => ({
        url: `/course/${course_id}/module/${module_id}/lecture`,
        method: "GET",
      }),
      providesTags: ["Lessons"],
    }),

    addLessonApi: builder.mutation({
      query: ({ course_id, module_id, lessons }) => ({
        url: `/course/${course_id}/module/${module_id}/lecture`,
        method: "POST",
        body: lessons[0],
      }),
      invalidatesTags: ["Lessons"],
    }),

    removeLessonApi: builder.mutation({
      query: ({ course_id, module_id, lesson_id }) => ({
        url: `/course/${course_id}/module/${module_id}/lecture/${lesson_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lessons"],
    }),


    //------------------------NOTES----------------------------------------------

    createNotesApi:builder.mutation({
      query:({course_id,module_id,lesson_id,notes})=>({
        url:`/course/${course_id}/module/${module_id}/lecture/${lesson_id}/notes`,
        method:"POST",
        body:notes
      }),
      invalidatesTags:["Notes"]
    }),

    getAdminNotesAdmin:builder.query({
      query:({course_id,module_id,lesson_id})=>({
        url:`/course/${course_id}/module/${module_id}/lecture/${lesson_id}/view_notes`,
        method:"GET",
      }),
      providesTags:["Notes"]
    })
  }),
});




export const {
  useGetAllUsersQuery,
  useGetAllAdminUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useAddNewUserMutation,
  useAddNewCourseMutation,
  useGetAllCoursesQuery,
  useUpdateUserStatusMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseStatusApiMutation,
  useGetAllModulesQuery,
  useAddModuleMutation,
  useDeleteModuleMutation,
  useGetAllLessonsQuery,
  useAddLessonApiMutation,
  useRemoveLessonApiMutation,
  useCreateNotesApiMutation,
  useGetAdminNotesAdminQuery
} = adminApi;

export default adminApi;
