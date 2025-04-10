import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Toolbar,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CoursesCard from "../../Components/Courses/CoursesCard"
import { useGetCourseQuery } from "./feature/courseApi";
import { setCourse } from "./feature/courseSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const filters = {
  category: ["Web Development", "Data Science", "UI/UX Design"],
  subcategory: ["Frontend", "Backend", "Full Stack"],
  level: ["Beginner", "Intermediate", "Advanced"],
  language: ["English", "Spanish", "French"],
};

const Courses = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: courses, isLoading, error } = useGetCourseQuery();
  const filteredCourses =
    courses?.filter((course) => course.status === "Published") || [];

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    subcategory: [],
    level: [],
    language: [],
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilter = { ...prevFilters };

      if (updatedFilter[filterType].includes(value)) {
        updatedFilter[filterType] = updatedFilter[filterType].filter(
          (item) => item !== value
        );
      } else {
        updatedFilter[filterType].push(value);
      }
      return updatedFilter;
    });
  };

  // Filter courses based on selected filters
  const getFilteredCourses = () => {
    if (
      !selectedFilters.category.length &&
      !selectedFilters.subcategory.length &&
      !selectedFilters.level.length &&
      !selectedFilters.language.length
    ) {
      return filteredCourses;
    }

    return filteredCourses.filter((course) => {
      return (
        (selectedFilters.category.length === 0 ||
          selectedFilters.category.includes(course.category)) &&
        (selectedFilters.subcategory.length === 0 ||
          selectedFilters.subcategory.includes(course.subcategory)) &&
        (selectedFilters.level.length === 0 ||
          selectedFilters.level.includes(course.level)) &&
        (selectedFilters.language.length === 0 ||
          selectedFilters.language.includes(course.language))
      );
    });
  };

  useEffect(() => {
    if (Array.isArray(filteredCourses)) {
      dispatch(setCourse(filteredCourses));
    }
  }, [filteredCourses, dispatch]);

  return (
    <>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: "#9275B3" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Courses
          </Typography>

          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Filters */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box
          sx={{ width: 280, p: 2 }}
          role="presentation"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {Object.entries(filters).map(([key, values]) => (
            <Box key={key} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  transition: "color 0.3s, transform 0.3s",
                  "&:hover": { color: "#02d1FF", transform: "scale(1.05)" },
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <FormGroup>
                {values.map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={selectedFilters[key].includes(value)}
                        onChange={() => handleFilterChange(key, value)}
                      />
                    }
                    label={value}
                  />
                ))}
              </FormGroup>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* Layout */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Sidebar Filt */}
        {!isMobile && (
          <Box
            sx={{
              width: isTablet ? "30%" : "20%",
              bgcolor: "#f5f5f5",
              p: 2,
              boxShadow: 1,
              zIndex: 1,
            }}
          >
            {Object.entries(filters).map(([key, values]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    transition: "color 0.3s, transform 0.3s",
                    "&:hover": { color: "#02d1FF", transform: "scale(1.05)" },
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <FormGroup sx={{fontSize:15}}>
                  {values.map((value) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          checked={selectedFilters[key].includes(value)}
                          onChange={() => handleFilterChange(key, value)}
                        />
                      }
                      label={value}
                    />
                  ))}
                </FormGroup>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: isMobile ? 0 : isTablet ? "10px" : "30px",
          }}
        >
          <Grid
            container
            spacing={isMobile ? 2 : isTablet ? 3 :8}
            justifyContent="start"
          >
            {getFilteredCourses().map((course) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={course.course_id}
              >
                <CoursesCard
                  course={course}
                  onClick={() =>
                    navigate(`/courses/course-details/${course.course_id}`, {
                      state: { course },
                    })
                  }
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
