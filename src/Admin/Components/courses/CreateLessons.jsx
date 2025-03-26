import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createLesson, setLessons } from "../../features/adminSlice";
import {
  useAddLessonApiMutation,
  useGetAllLessonsQuery,
} from "../../features/adminApi";

const CreateLessons = ({ onClose }) => {
  const dispatch = useDispatch();
  const [addLessonApi] = useAddLessonApiMutation();
  const { data: lessons } = useGetAllLessonsQuery();
  const { course_id, module_id } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (lessons) {
      dispatch(setLessons(lessons));
    }
  }, [lessons, dispatch]);

  const [lesson, setLesson] = useState({
    title: "",
    content_url: "",
    content_type: "",
    duration_minutes: "",
    isDownloadable: false,
    position: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setLesson((prev) => ({ ...prev, isDownloadable: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!lesson.title || !lesson.content_type) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      const response = await addLessonApi({
        course_id,
        module_id,
        lessons: [lesson],
      }).unwrap();

      dispatch(createLesson(response));
      setSnackbarMessage("Lesson added successfully!!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setLesson({
        title: "",
        content_url: "",
        content_type: "",
        duration_minutes: "",
        isDownloadable: false,
        position: "",
      });

      onClose(); // Close form after submission
    } catch (error) {
      console.error("Error adding lesson:", error);
      setSnackbarMessage("Faild to add lesson!!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box component={Paper} p={3} elevation={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Add Lesson</Typography>
          <IconButton onClick={onClose} color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lesson Title"
              fullWidth
              name="title"
              value={lesson.title}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Content URL"
              fullWidth
              name="content_url"
              value={lesson.content_url}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Content Type</InputLabel>
              <Select
                name="content_type"
                value={lesson.content_type}
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="">Select Content Type</MenuItem>
                <MenuItem value="Document">Document</MenuItem>
                <MenuItem value="Quiz">Quiz</MenuItem>
                <MenuItem value="Live Session">Live Session</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration (minutes)"
              type="number"
              fullWidth
              name="duration_minutes"
              value={lesson.duration_minutes}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Position"
              type="number"
              fullWidth
              name="position"
              value={lesson.position}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={lesson.isDownloadable}
                  onChange={handleCheckboxChange}
                />
              }
              label="Downloadable"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Save Lesson
            </Button>

            <Button variant="text" fullWidth onClick={onClose} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateLessons;
