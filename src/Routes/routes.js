// src/routes/index.js



import Login from "../Pages/Auth/Login";
import SignUpForm from "../Pages/Auth/SignUpForm";
import CourseDetails from "../Pages/Courses/CourseDetails";
import Courses from "../Pages/Courses/Courses";
import VideoScreen from "../Pages/Courses/VideoScreen";
import HomePage from "../Pages/Home/HomePage";




const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: SignUpForm,
  },
  {
    path:"/courses",
    component:Courses
  },
  {
    path:`/courses/course-details/:course_id`,
    component:CourseDetails
  },
  {
    path:`/courses/course-details/:course_id/video`,
    component:VideoScreen
  }

  
  // Add more routes here as needed
];

export default routes;
