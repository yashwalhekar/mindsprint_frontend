import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CoursesCard from "./CoursesCard";
import { useGetCourseQuery } from "./feature/courseApi";
import { setCourse } from "./feature/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEnrollUserMutation } from "../Enrollment/feature/enrollmentApi";

const drawerWidth = 240;

const filters = {
  category: ["Web Development", "Data Science", "UI/UX Design"],
  subcategory: ["Frontend", "Backend", "Full Stack"],
  level: ["Beginner", "Intermediate", "Advanced"],
  language: ["English", "Spanish", "French"],
};

const Courses = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const { data: courses, isLoading, error } = useGetCourseQuery();
  const filteredCourses = courses?.filter(
    (course) => course.status === "Published"
  )||[];
  console.log(filteredCourses);
  


  // const [enrollUser, { isLoading: isEnrolling }] = useEnrollUserMutation();
  // const loggedInUser = useSelector((state) => state.auth.user.user_id);
  // console.log("log",loggedInUser);
  

  // const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  // const handleEnroll = async (courseId) => {
  //   if (!loggedInUser) {
  //     alert("Please log in to enroll.");
  //     return;
  //   }

  //   try {
  //     const response = await enrollUser({
  //       user_id: loggedInUser,
  //       course_id: courseId,
  //     }).unwrap();

  //     if (response) {
  //       setEnrolledCourses((prev) => new Set(prev).add(courseId));
  //       alert("Enrolled successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Enrollment failed:", error);
  //   }
  // };


  useEffect(() => {
    if (Array.isArray(filteredCourses)) {
      dispatch(setCourse(filteredCourses)); // ✅ Dispatching only an array
    }
  }, [filteredCourses, dispatch]);
  

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#9275B3",
          color: "#fff",
          height: 40,
          display: "flex",
          alignItems: "center",
          width: "100%",
          zIndex: theme.zIndex.drawer + 2,
        }}
      >
        {/* <Typography variant="body2">Courses = Free</Typography> */}
      </Box>

      {/* Sidebar + Main Content Layout */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar Filters */}
        <Box
          sx={{
            width: drawerWidth,
            height: "150vh",
            position: "absolute",
            left: 0,
            top: 150,
            bgcolor: "#f5f5f5",
            p: 2,
            boxShadow: 1,
          }}
        >
          {/* Filters Section */}
          {Object.entries(filters).map(([key, values]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  transition: "color 0.3s, transform 0,3s",
                  "&:hover": { color: "#02d1FF", transform: "scale(1.05)" },
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <FormGroup>
                {values.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={<Checkbox />}
                    label={value}
                  />
                ))}
              </FormGroup>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `280px` }}>
          {/* <Typography variant="h4" gutterBottom>
                        Available Courses
                    </Typography> */}

          {/* Course Cards Grid */}
          <Grid container spacing={3}>
            {filteredCourses &&
              filteredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.course_id}>
                 <CoursesCard
                  course={course}
                  onClick={() =>
                    navigate(`/courses/course-details/${course.course_id}`, {
                      state: { course },
                    })
                  }
                  // onEnroll={handleEnroll}
                  // // isEnrolled={enrolledCourses.has(course.course_id)}
                />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Courses;
