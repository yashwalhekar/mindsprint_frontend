import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CourseCard from "./CoursesCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetLessonsQuery, useGetModulesQuery } from "./feature/courseApi";
import { useDispatch, useSelector } from "react-redux";
import { setModules } from "./feature/courseSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../Home/Footer";

function CourseDetails() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { course } = location.state || {};
  const navigate = useNavigate();

  const { course_id } = useParams();

  const { data: modules } = useGetModulesQuery();

  const filteredModules = modules?.filter(
    (module) => module.course_id == course_id
  );
  const module_id = filteredModules?.length
    ? filteredModules[0].module_id
    : null;

  const {
    data: lessons,
    error,
    isLoading,
  } = useGetLessonsQuery({ course_id, module_id }) || {};

  const isLoggedin = useSelector((state) => state.auth.isAuthenticated);
  console.log("login", isLoggedin);

  const handleWatchNow = () => {
    if (isLoggedin) {
      navigate(`/courses/course-details/${course_id}/video`, {
        state: { video_url: course.video_url, title: course.title }, // Add 'title'
      });
    } else {
      alert("You must be logged in to watch this course.");
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <>
      <Box
        p={3}
        display="flex"
        boxShadow={2}
        position="relative"
        mt={2}
        flexWrap="wrap"
      >
        <Box display="flex" gap={3}>
          <img
            src={course.image_url}
            alt="img"
            width="220"
            height="200"
            style={{ borderRadius: "5px" }}
          />
          <Box
            display="flex"
            flexDirection="column"
            p={3}
            flexGrow={1}
            minWidth={250}
          >
            <Typography
              variant="titled"
              fontSize="24px"
              fontWeight="bold"
              fontFamily="jomolhari"
            >
              {course.title}
            </Typography>
            <Typography
              variant="subtitled"
              sx={{
                fontSize: "17px",
                fontFamily: "jomolhari",
                my: 2,
                fontWeight: "bold",
              }}
            >
              {course.creator}
            </Typography>
            <Typography
              variant="subtitled"
              fontSize="17px"
              fontFamily="jomolhari"
              sx={{ maxWidth: "67%" }}
            >
              {course.description}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "40px", // Moves part of the card outside the box
            top: "100%",
            transform: "translateY(-50%)",
            zIndex: 1, // Ensures it appears above other elements
          }}
        >
          <Box>
            <Card
              sx={{
                width: 300,
                height: 350,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                borderRadius: "10px",
              }}
            >
              {/* Clickable Image to Open Video Modal */}
              <CardMedia
                component="img"
                height="170"
                image={course.image_url}
                alt={course.title}
                sx={{ cursor: "pointer" }} // Makes it clickable
              />

              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "jomolhari",
                    fontSize: "25px",
                  }}
                >
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "jomolhari",
                    fontSize: "18px",
                  }}
                >
                  {course.creator}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 3 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleWatchNow}
                >
                  Watch Now
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* course details section */}
      <Box p={3}>
        <Typography
          variant="h6"
          sx={{
            background:
              "linear-gradient(90deg, rgba(71, 104, 222), rgba(90, 138, 227, 0.8))",
            maxWidth: "70%",
            p: 2,
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          What you'll Learn
        </Typography>

        <Box component={Paper} maxWidth="70%" p={2}>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
            In this course, you will learn:
          </Typography>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Understanding React components and JSX</li>
            <li>Managing state and props effectively</li>
            <li>Handling user events and forms</li>
            <li>Using React Hooks (useState, useEffect, etc.)</li>
            <li>Working with React Router for navigation</li>
            <li>
              Fetching data from APIs and handling asynchronous operations
            </li>
            <li>State management with Context API and Redux</li>
            <li>Optimizing performance with React.memo and useCallback</li>
            <li>Deploying React applications</li>
          </ul>
        </Box>
      </Box>

      <Box p={3} maxWidth="90%" component={Paper}>
        <Typography
          variant="h6"
          sx={{
            background:
              "linear-gradient(90deg, rgba(71, 104, 222), rgba(90, 138, 227, 0.8))",
            p: 2,
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Modules
        </Typography>
        {filteredModules && filteredModules.length > 0 ? (
          filteredModules
            .filter((module) => module.course_id === course.course_id)
            .map((module) => (
              <Accordion key={module.module_id} sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{module.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Array.isArray(lessons) && lessons.length > 0 ? (
                    lessons.filter(
                      (lesson) => lesson.module_id === module.module_id
                    ).length > 0 ? (
                      lessons
                        .filter(
                          (lesson) => lesson.module_id === module.module_id
                        )
                        .map((lesson) => (
                          <Typography key={lesson.lesson_id} sx={{ pl: 2 }}>
                            - {lesson.title}
                          </Typography>
                        ))
                    ) : (
                      <Typography>No Lessons Available...</Typography>
                    )
                  ) : (
                    <Typography>Loading Lessons...</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
        ) : (
          <Typography>No Modules Available..</Typography>
        )}
      </Box>
      <Footer />
    </>
  );
}

export default CourseDetails;
