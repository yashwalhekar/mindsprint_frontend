import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../Pages/Auth/feature/authSlice";
import { authApi } from "../Pages/Auth/feature/authApi";
import adminReducer from "../Admin/features/adminSlice";
import adminApi  from "../Admin/features/adminApi";
import courseReducer from "../Pages/Courses/feature/courseSlice";
import { courseApi } from "../Pages/Courses/feature/courseApi";
import { enrollmentApi } from "../Pages/Enrollment/feature/enrollmentApi";

// ✅ Create a single persist config for the whole root reducer
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "admin", "course"], // ✅ Persist these reducers
};

// ✅ Combine all reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  course: courseReducer,
  [authApi.reducerPath]: authApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [enrollmentApi.reducerPath]: enrollmentApi.reducer
});

// ✅ Apply persistReducer to the root reducer (not individual ones)
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      adminApi.middleware,
      courseApi.middleware,
      enrollmentApi.middleware
      
    ),
  devTools: process.env.NODE_ENV !== "production", // ✅ Enable Redux DevTools
});

export const persistor = persistStore(store);
