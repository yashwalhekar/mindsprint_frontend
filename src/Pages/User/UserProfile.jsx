import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Grid,
  Tabs,
  Tab,
  CardMedia,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { useGetEnrolledCourseByUsersApiQuery } from "../Enrollment/feature/enrollmentApi";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: enrolledCourses } = useGetEnrolledCourseByUsersApiQuery();
  const [tabIndex, setTabIndex] = useState(0);

  if (!user)
    return <Typography textAlign="center">Loading user profile...</Typography>;

  const userCourses = enrolledCourses?.data?.filter(
    (course) => course.user_id === user.user_id
  );

  return (
    <Box sx={{ p: 4 }}>
      {/* Tabs Navigation */}
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="User Information" />
        <Tab label="Courses Enrolled" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      {tabIndex === 0 && (
        <Box>
          <Box
            component={Paper}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              mt: 3,
              p: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={user.profile_image || ""}
              sx={{ width: 100, height: 100, textAlign: "center" }}
            >
              {user.first_name?.charAt(0)}
              {user.last_name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                {user.first_name} {user.last_name}
              </Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Phone: {user.phone}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box mt={3}>
          {userCourses && userCourses.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {userCourses.map((course, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                      borderRadius: "12px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        course.image_url ||
                        "https://via.placeholder.com/400x200?text=Course+Image"
                      }
                      alt={course.course_name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {course.course_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enrolled on:{" "}
                        {new Date(course.enrollment_date).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography textAlign="center">No courses enrolled.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
