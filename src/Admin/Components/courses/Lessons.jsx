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
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { removeLesson, setLessons } from "../../features/adminSlice";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import {
  useGetAdminNotesAdminQuery,
  useGetAllLessonsQuery,
  useGetAllModulesQuery,
  useRemoveLessonApiMutation,
} from "../../features/adminApi";
import CreateLessons from "./CreateLessons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

const Lessons = () => {
  const { course_id: courseIdParam, module_id: moduleIdParam } = useParams();
  const course_id = Number(courseIdParam);
  const module_id = Number(moduleIdParam);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: lessons } =
    useGetAllLessonsQuery({ course_id, module_id }) || {};
  const filteredLessons =
    lessons?.filter((lesson) => lesson.module_id == module_id) || [];

  const [deleteLesson] = useRemoveLessonApiMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openNotes, setOpenNotes] = useState(false);

  const { data: modules } = useGetAllModulesQuery(course_id);

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
  const { data: notes } = useGetAdminNotesAdminQuery(
    selectedLesson
      ? { course_id, module_id, lesson_id: selectedLesson.lesson_id }
      : {},
    { skip: !selectedLesson } // Prevents running query when there's no selected lesson
  );

  const handleViewNotes = (lesson) => {
    setSelectedLesson(lesson);
    setOpenNotes(true);
  };
  useEffect(() => {
    if (lessons) {
      dispatch(setLessons(lessons));
    }
  }, [lessons, dispatch]);

  console.log("Fetching notes with:", {
    course_id,
    module_id,
    lesson_id: selectedLesson?.lesson_id,
  });
  console.log("notes:", notes?.data);

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
        mb={2}
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
                    

                    <IconButton
                      color="primary"
                      onClick={() => handleViewNotes(lesson)}
                    >
                      <StickyNote2Icon />
                    </IconButton>

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`${lesson.lesson_id}/add-notes/`)}
                      sx={{ ml: 1 }}
                    >
                      Add Notes
                    </Button>
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
      {/* Notes Dialog */}
      <Dialog open={openNotes} onClose={() => setOpenNotes(false)} fullWidth  maxWidth="md" sx={{ "& .MuiDialog-paper": { width: "900px" } }}>
        <DialogTitle>Lesson Notes</DialogTitle>
        <Divider sx={{my:2}}/>
        <DialogContent>
          {notes?.data?.length > 0 ? (
            notes?.data?.map((note, index) => (
              <>
              <Typography key={index} sx={{ mb: 1 }}>
                <strong>Title:</strong>{note.title}
              </Typography>
              <Typography key={index} sx={{ mb: 1 }}>
              <strong>Content:</strong>{note.content}
              </Typography>
              {index !== notes.data.length - 1 && <Divider sx={{ my: 1 }} />}
            
              </>
            ))
          ) : (
            <Typography>No notes available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotes(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lessons;
