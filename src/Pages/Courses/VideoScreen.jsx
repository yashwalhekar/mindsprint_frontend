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
  Tabs,
  Tab,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import Modules from "../../Components/Courses/Modules";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AdminNotes from "../../Components/Courses/Notes/AdminNotes";
import UserNote from "../../Components/Courses/Notes/UserNote";

const drawerWidth = 320;
const bottomNavHeight = 64;
const navbarHeight = 67;

const VideoScreen = () => {
  const location = useLocation();
  const [videoUrl, setVideoUrl] = useState(location.state?.video_url || "");
  const [title, setTitle] = useState(location.state?.title || "Course Video");
  const [value, setValue] = useState(0);
  const [notesTab, setNotesTab] = useState(0);
  const [modulesId,setModuleId] = useState(null)
  const [lessonsId,setLessonId] = useState(null)
  const navigate = useNavigate();

  const isLoggedin = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isLoggedin) {
      alert("You must be logged in to view this content.");
      navigate("/login");
    }
  }, [isLoggedin, navigate]);

  const handlePlayVideo = (url, title,moduleId,lessonId) => {
    setVideoUrl(url);
    setTitle(title);
    setModuleId(moduleId);
    setLessonId(lessonId)
  };

  console.log("Module Id",modulesId)
  console.log("lessons id",lessonsId)

  return (
    <Box display="flex" minHeight="100vh">
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          mt: `${navbarHeight}px`,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            mt: `${navbarHeight}px`,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box p={2} overflow="auto">
          <Typography variant="h6" gutterBottom textAlign="center">
            Modules
          </Typography>
          <Divider />
          <Modules onPlayVideo={handlePlayVideo} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Video Player */}
        <Box flexGrow={1} display="flex" flexDirection="column">
          <VideoPlayer video_url={videoUrl} title={title} />

          {/* Bottom Navigation */}
          <Paper sx={{ position: "relative", width: "100%", mt: 2 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
            >
              <BottomNavigationAction label="Course Content" icon={<LibraryBooksIcon />} />
              <BottomNavigationAction label="Notes" icon={<DescriptionIcon />} />
            </BottomNavigation>
          </Paper>
        </Box>

        {/* Render Content Below Navigation Based on Selection */}
        <Box p={3}>
          {value === 0 && <Typography variant="h6">📚 Course Content</Typography>}
          {value === 1 && (
            <Box>
              {/* Notes Navbar */}
              <Tabs value={notesTab} onChange={(e, newValue) => setNotesTab(newValue)}>
                <Tab label="User Notes" />
                <Tab label="Admin Notes" />
              </Tabs>

              {/* Notes Sections */}
              <Box mt={3}>
                {notesTab === 0 && <UserNote moduleId={modulesId} lessonId={lessonsId} />} {/* User Notes Section */}
                {notesTab === 1 && <AdminNotes moduleId={modulesId} lessonId={lessonsId} />} {/* Admin Notes Section */}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VideoScreen;
