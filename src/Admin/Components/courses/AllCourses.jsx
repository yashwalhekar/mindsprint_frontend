import React, { useState } from "react";
import {
  useGetAllCoursesQuery,
  useGetAllLessonsQuery,
  useGetAllModulesQuery,
  useUpdateCourseStatusApiMutation,
} from "../../features/adminApi";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AllCourses = ({ course_id}) => {
  const { data, isLoading, isError } = useGetAllCoursesQuery();
  const courses = data || [];
  console.log("courses in all course",courses)
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const courseId = courses?.[0]?.course_id ?? '';
  const { data: modules = [] } = useGetAllModulesQuery(courseId) || {};
  console.log("Modules in all course",modules);
  const module_id = modules?.[0]?.module_id
  const { data: lessons } =
    useGetAllLessonsQuery({ course_id, module_id }) || {};
  
  const [updateStatus] = useUpdateCourseStatusApiMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleInfo = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };
  const handleModuleClick = (course) => {
    navigate(`${course.course_id}/modules`, { state: { courses } });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleStatus = async (course) => {
    if (!course || !course.course_id) {
      console.error("Invalid course object:", course);
      return;
    }
    const newStatus = course.status === "Published" ? "Unpublish" : "Published";
    try {
      console.log("Updating course ID:", course.course_id);
      console.log("New status:", newStatus);
      
      await updateStatus({ course_id: course.course_id, status: newStatus }).unwrap();
     
      
      console.log("Course status updated successfully");
    } catch (error) {
      console.error("Failed to update Course status:", error);
    }
  };

  if (isLoading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />;
  if (isError) return <p>Error fetching courses !!</p>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 2,
          bgcolor: "#64b5f6",
          fontFamily: "Jomolhari",
          color: "white",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
          width: "100%",
        }}
      >
        Course List
      </Typography>

      <Box
        display="flex"
        gap={2}
        sx={{
          width: isMobile ? "90%" : isTablet ? "45%" : "100%",
          flexDirection: isMobile ? "column" : isTablet ? "row" : "column",
        }}
      >
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: isMobile
                  ? "column"
                  : isTablet
                  ? "column"
                  : "row",
                alignItems: "center",
                width: "100%",
                gap: 2,
                boxShadow: 4,
              }}
            >
              {/* Image */}
              <img
                src={course.image_url}
                alt={course.title}
                style={{
                  width: isMobile ? "100%" : "200px",
                  height: isMobile ? "auto" : "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />

              {/* Title */}
              <Box
                sx={{
                  flexGrow: 1,
                  ml: isMobile ? 0 : 4,
                  mt: isMobile ? 2 : 0,
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontFamily: "Jomolhari" }}
                >
                  {course.title}
                </Typography>
                <Typography sx={{ fontFamily: "Jomolhari",fontWeight:"bold" }}>
                  {course.creator}
                </Typography>
                <Typography sx={{ fontFamily: "Jomolhari" }}>
                  {course.category}
                </Typography>
              </Box>

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile
                    ? "column"
                    : isTablet
                    ? "row"
                    : "column",
                  gap: 1,
                  mt: isMobile ? 2 : 0,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleInfo(course)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => handleModuleClick(course)}
                >
                  Add Modules
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color={course.status === "Published"?"error":"primary"}
                  onClick={() => handleStatus(course)}
                >
                  {course.status === "Published"?"Unpublish":"Published"}
                </Button>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="h6">No Course Found...</Typography>
        )}
      </Box>

      {/* Dialog box */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: isMobile ? "20px" : "25px",
            fontFamily: "Jomolhari",
            fontWeight: "bold",
          }}
        >
          Course Details
        </DialogTitle>
        <DialogContent sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          {selectedCourse && (
            <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" fontWeight="bold">
                Course Title: {selectedCourse.title}
              </Typography>
              <img
                src={selectedCourse.image_url}
                alt={selectedCourse.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
              <Typography>
                <strong>Category:</strong> {selectedCourse.category}
              </Typography>
              <Typography>
                <strong>Sub-Category:</strong> {selectedCourse.subcategory}
              </Typography>
              <Typography>
                <strong>Level:</strong> {selectedCourse.level}
              </Typography>
              <Typography>
                <strong>Language:</strong> {selectedCourse.language}
              </Typography>
              <Typography>
                <strong>Price:</strong> ${selectedCourse.price}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  bgcolor: "#64b5f6",
                  p: 2,
                  color: "white",
                  borderRadius: 2,
                }}
              >
                Modules
              </Typography>
              {modules && modules.length > 0 ? (
                modules
                  .filter(
                    (module) => module.course_id === selectedCourse.course_id
                  )
                  .map((module) => (
                    <Accordion key={module.module_id} sx={{ mt: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{module.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {lessons && lessons.length > 0 ? (
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
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))
              ) : (
                <Typography>No Modules Available..</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllCourses;
