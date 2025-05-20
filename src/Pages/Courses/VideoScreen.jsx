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
  IconButton,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DescriptionIcon from "@mui/icons-material/Description";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Modules from "../../Components/Courses/Modules";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNotes from "../../Components/Courses/Notes/AdminNotes";
import UserNote from "../../Components/Courses/Notes/UserNote";
import QuizScreen from "../../Components/Courses/QuizScreen";
import { useGetQuizApiQuery } from "./feature/courseApi";

const drawerWidth = 320;
const navbarHeight = 67;

const VideoScreen = () => {
  const location = useLocation();
  const [videoUrl, setVideoUrl] = useState(location.state?.video_url || "");
  const [title, setTitle] = useState(location.state?.title || "Course Video");
  const [value, setValue] = useState(0);
  const [notesTab, setNotesTab] = useState(0);
  const [modulesId, setModuleId] = useState(null);
  const [lessonsId, setLessonId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isQuizMode, setIsQuizMode] = useState(false);

  const navigate = useNavigate();
  const isLoggedin = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isLoggedin) {
      alert("You must be logged in to view this content.");
      navigate("/login");
    }
  }, [isLoggedin, navigate]);

  const handlePlayVideo = (url, title, moduleId, lessonId) => {
    setVideoUrl(url);
    setTitle(title);
    setModuleId(moduleId);
    setLessonId(lessonId);
    setIsQuizMode(false); // it's a video, not a quiz
    setIsDrawerOpen(false); // auto-close drawer on selection
  };
  const handlePlayQuiz = (quizData, moduleId, lessonId) => {
    setQuizQuestions(quizData.questions || []); // make sure quizData contains `questions`
    setTitle(quizData.title);
    setModuleId(moduleId);
    setLessonId(lessonId);
    setIsQuizMode(true); // it's a quiz
    setIsDrawerOpen(false);
  };

  return (
    <Box display="flex">
      {/* Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
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
          <Modules onPlayVideo={handlePlayVideo} onPlayQuiz={handlePlayQuiz} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Arrow Icon to Open Drawer */}
        {!isDrawerOpen && (
          <IconButton
            onClick={() => setIsDrawerOpen(true)}
            sx={{
              position: "absolute",
              top: navbarHeight + 16,
              left: 8,
              zIndex: 1300, // above drawer
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Video Player */}
        <Box flexGrow={1} display="flex" flexDirection="column">
          {isQuizMode ? (
            <QuizScreen questions={quizQuestions} />
          ) : (
            <VideoPlayer video_url={videoUrl} title={title} />
          )}

          {/* Bottom Navigation */}
          <Paper
            sx={{ position: "relative", width: "100%", mt: 2 }}
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

        {/* Tab Content */}
        <Box p={3}>
          {value === 0 && (
            <Typography variant="h6">📚 Course Content</Typography>
          )}
          {value === 1 && (
            <Box>
              <Tabs
                value={notesTab}
                onChange={(e, newValue) => setNotesTab(newValue)}
              >
                <Tab label="User Notes" />
                <Tab label="Admin Notes" />
              </Tabs>

              <Box mt={3}>
                {notesTab === 0 && (
                  <UserNote moduleId={modulesId} lessonId={lessonsId} />
                )}
                {notesTab === 1 && (
                  <AdminNotes moduleId={modulesId} lessonId={lessonsId} />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VideoScreen;
