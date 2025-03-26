import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  adminUsers: [],
  courses: [],
  modules: [], // Add modules state here
  lessons: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    setUsers: (state, action) => {
      console.log("setUsers Triggered:", action.payload);
      state.users = action.payload;
    },
    setAdminUsers: (state, action) => {
      console.log("setAdminUsers Triggered:", action.payload);
      state.adminUsers = action.payload;
    },
    addUser: (state, action) => {
      console.log("addUser Triggered:", action.payload);
      state.users.push(action.payload);
    },
    addCourse: (state, action) => {
      console.log("addCourse Triggered:", action.payload);
      state.courses.push(action.payload);
    },
    setCourses: (state, action) => {
      console.log("setCourses Triggered:", action.payload);
      state.courses = action.payload;
    },
    removeCourse: (state, action) => {
      console.log("removeCourse Triggered:", action.payload);
      state.courses = state.courses.filter(
        (course) => course.id !== action.payload
      );
    },

    //________________________________________Modules_________________________________________________________
    
    setModules: (state, action) => {
      console.log("setModules Triggered with Payload:", action.payload);
      state.modules = action.payload;
    },

    addModules: (state, action) => {
      console.log("addModules Triggered with Payload:", action.payload);
      if (Array.isArray(action.payload)) {
        state.modules = [...state.modules, ...action.payload];
      } else {
        state.modules.push(action.payload);
      }
    },

    deleteModule: (state, action) => {
      const { course_id, module_id } = action.payload;
      state.modules = state.modules.filter(
        (module) => !(module.course_id === course_id && module.id === module_id)
      );
    },

    //-------------------------------Lessons-------------------------------------------------------------

    setLessons: (state, action) => {
      console.log("setLessons Triggered with Payload:", action.payload);
      state.lessons = action.payload;
    },

    createLesson: (state, action) => {
      console.log("createLesson Triggered with Payload:", action.payload);

      // Ensure `state.lessons` is always an array before modifying
      if (!Array.isArray(state.lessons)) {
        state.lessons = [];
      }

      if (Array.isArray(action.payload)) {
        state.lessons = [...state.lessons, ...action.payload]; // Spread for multiple lessons
      } else if (action.payload) {
        state.lessons.push(action.payload); // Push for a single lesson
      } else {
        console.warn("createLesson received undefined payload!");
      }
    },

    removeLesson: (state, action) => {
      const { lesson_id } = action.payload;
      state.lessons = state.lessons.filter(
        (lesson) => lesson.lesson_id !== lesson_id
      );
    },
  },
});

export const {
  setUsers,
  setAdminUsers,
  addUser,
  addCourse,
  setCourses,
  removeCourse,
  setModules,
  addModules,
  deleteModule,
  setLessons,
  createLesson,
  removeLesson,
} = adminSlice.actions;
export default adminSlice.reducer;
