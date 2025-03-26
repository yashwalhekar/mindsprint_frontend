import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  course: [],
  modules:[],
  lessons:[],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      return { ...state, course: action.payload }; // ✅ Correctly replacing state
    },
        
    setModules: (state, action) => {
      return {...state,modules:action.payload}
    },
    setLessons: (state, action) => {
      return {...state,lessons:action.payload}
    },

  },
});

export const { setCourse,setModules,setLessons } = courseSlice.actions;
export default courseSlice.reducer;
