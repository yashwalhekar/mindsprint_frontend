import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { removeLesson, setLessons } from "../../features/adminSlice";
import {
  useGetAllLessonsQuery,
  useGetAllModulesQuery,
  useRemoveLessonApiMutation,
} from "../../features/adminApi";
import CreateLessons from "./CreateLessons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

const Lessons = () => {
  const { course_id, module_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { data: lessons } =
    useGetAllLessonsQuery({ course_id, module_id }) || {};
  const filteredLessons =
    lessons?.filter((lesson) => lesson.module_id == module_id) || [];

  const [deleteLesson] = useRemoveLessonApiMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { data: modules } = useGetAllModulesQuery(course_id);
  console.log("modules",modules);
  
  const filterModule = modules?.find((module) => module.module_id == module_id);

  const handleInfoOpen = (lesson) => {
    setSelectedLesson(lesson);
    setOpenInfo(true);
  };

  const handleInfoClose = () => {
    setOpenInfo(false);
    setSelectedLesson(null);
  };

  const handleDelete = async (lesson_id) => {
    await deleteLesson({ lesson_id }).unwrap();
    dispatch(removeLesson({ lesson_id }));
  };

  useEffect(() => {
    if (lessons) {
      dispatch(setLessons(lessons));
    }
  }, [lessons, dispatch]);

  return (
    <Box component={Paper} p={3} elevation={3} position="relative">
      {/* Back Button Positioned at Top-Right */}
      <IconButton
        onClick={() => navigate(-1)}
        color="primary"
        sx={{ position: "absolute", top: 5, right: 8 }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Header with Title and Add Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2} // Adding margin to separate from list
      >
        <Typography variant="h6" color="secondary" sx={{ fontSize: "25px" }}>
          Lessons in {filterModule?.title || "Unknown Module"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ mt: 5 }}
        >
          Add Lesson
        </Button>
      </Box>

      {openCreate ? (
        <CreateLessons onClose={() => setOpenCreate(false)} />
      ) : filteredLessons.length > 0 ? (
        <List>
          {filteredLessons.map((lesson, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton
                      color="info"
                      onClick={() => handleInfoOpen(lesson)}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(lesson.lesson_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={lesson.title}
                  secondary={`Type: ${lesson.content_type} | Duration: ${lesson.duration_minutes} min | Position: ${lesson.position}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography align="center" color="textSecondary" mt={3}>
          No lessons available.
        </Typography>
      )}

      {/* Lesson Info Dialog */}
      <Dialog open={openInfo} onClose={handleInfoClose}>
        <DialogTitle>Lesson Details</DialogTitle>
        <DialogContent>
          {selectedLesson && (
            <Box>
              <Typography>
                <b>Title:</b> {selectedLesson.title}
              </Typography>
              <Typography>
                <b>Content Type:</b> {selectedLesson.content_type}
              </Typography>
              <Typography>
                <b>Duration:</b> {selectedLesson.duration_minutes} min
              </Typography>
              <Typography>
                <b>Position:</b> {selectedLesson.position}
              </Typography>
              <Typography>
                <b>Downloadable:</b>{" "}
                {selectedLesson.isDownloadable ? "Yes" : "No"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lessons;
