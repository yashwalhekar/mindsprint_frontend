import React, { useEffect, useState } from "react";
import VideoPlayer from "../../Components/Courses/VideoPlayer";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Typography,
  Drawer,
  Toolbar,
  Divider,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import Modules from "../../Components/Courses/Modules";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 320; // Sidebar width
const bottomNavHeight = 64; // Bottom navigation height
const navbarHeight = 67; // Adjust this to match your Navbar height

const VideoScreen = () => {
  const location = useLocation();
  const [videoUrl, setVideoUrl] = useState(location.state?.video_url || "");
  const [title, setTitle] = useState(location.state?.title || "Course Video");
  const [value, setValue] = useState(0);
  const navigate = useNavigate()

  
    const isLoggedin = useSelector((state) => state.auth.isAuthenticated);
  console.log("islog",isLoggedin);
  

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedin) {
      alert("You must be logged in to view this content.");
      navigate("/login");  // Redirect to login page
    }
  }, [isLoggedin, navigate]);

  // Function to update video URL and title
  const handlePlayVideo = (url, title) => {
    setVideoUrl(url);
    setTitle(title);
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Left Sidebar for Modules - Below Navbar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          mt: `${navbarHeight}px`, // Pushes sidebar below navbar
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            mt: `${navbarHeight}px`, // Ensures sidebar starts below navbar
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> {/* Placeholder to match navbar height */}
        <Box p={2} overflow="auto">
          <Typography variant="h6" gutterBottom textAlign="center">
            Modules
          </Typography>
          <Divider></Divider>
     
            <Modules onPlayVideo={handlePlayVideo} />
         
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Video Player Section */}
        <Box flexGrow={1} display="flex" flexDirection="column" f>
          <VideoPlayer video_url={videoUrl} title={title} />

          {/* Bottom Navigation Bar - Directly below Video Player */}
          <Paper
            sx={{
              position: "relative", // No fixed position, so it sits naturally below the video
              width: "100%",
              mt: 2, // Adds spacing between video player and bottom navigation
            }}
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
            >
              <BottomNavigationAction
                label="Course Content"
                icon={<LibraryBooksIcon />}
              />
              <BottomNavigationAction
                label="Notes"
                icon={<DescriptionIcon />}
              />
            </BottomNavigation>
          </Paper>
        </Box>

        {/* Render Content Below Navigation Based on Selection */}
        <Box p={3}>
          {value === 0 && (
            <Typography variant="h6">📚 Course Content</Typography>
          )}
          {value === 1 && <Typography variant="h6">📝 Notes</Typography>}
        </Box>
      </Box>
    </Box>
  );
};

export default VideoScreen;
