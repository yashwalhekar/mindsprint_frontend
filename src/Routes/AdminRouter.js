import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../Admin/Admin";
import AdminDashboard from "../Admin/Components/AdminDashboard";

import AllCourses from "../Admin/Components/courses/AllCourses";
import CreateCourse from "../Admin/Components/courses/CreateCourses";
import UserDetails from "../Admin/Components/User/UserDetails";
import AddUser from "../Admin/Components/User/AddUser";
import Modules from "../Admin/Components/courses/Modules";
import CreateLessons from "../Admin/Components/courses/CreateLessons";
import Lessons from "../Admin/Components/courses/Lessons";
import Notes from "../Admin/Components/courses/Notes";
import AdminPrivateRoute from "./AdminPrivateRoute";
import CourseQuestions from "../Admin/Components/CourseQuestions/CourseQuestions";
import EnrolledUsers from "../Admin/Components/User/EnrolledUsers";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminPrivateRoute/>}>
        <Route path="" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users/viewdetails" element={<UserDetails />} />
          <Route path="users/enrolledUsers" element={<EnrolledUsers/>} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses/:course_id/modules" element={<Modules />} />
          <Route path="testQuestions" element={<CourseQuestions/>}/>

          <Route
            path="courses/:course_id/modules/:module_id/lectures"
            element={<Lessons />}
          />

          <Route
            path="courses/:course_id/modules/:module_id/lectures/:lesson_id/add-notes"
            element={<Notes />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRouter;
