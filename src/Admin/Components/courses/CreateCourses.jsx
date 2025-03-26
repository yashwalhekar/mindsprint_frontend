import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addCourse } from "../../features/adminSlice";
import { useAddNewCourseMutation } from "../../features/adminApi";

const levels = ["Beginner", "Intermediate", "Advanced"];

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    promo_video: "",
    video: "",
    category: "",
    level: "",
    language: "",
    duration: "",
    price: "",
    rating: "",
    instructor_id: "",
    creator:""
  });

  const [imageFile, setImageFile] = useState(null);
  const [promoVideoFile, setPromoVideoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const dispatch = useDispatch();
  const [addNewCourse] = useAddNewCourseMutation();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file selection and convert to base64
  const handleFileChange = (e, fieldName, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: reader.result, // Save base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      level: formData.level,
      language: formData.language,
      duration_hours: Number(formData.duration),
      image_url: formData.image,
      promo_video_url: formData.promo_video,
      video_url: formData.video,
      price: Number(formData.price),
      rating: formData.rating ? Number(formData.rating) : undefined,
      instructor_id: formData.instructor_id,
      creator:formData.creator
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await addNewCourse(payload).unwrap();
      dispatch(addCourse(response));
      setSnackbarMessage("Course added successfully!!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Reset form fields
      setFormData({
        title: "",
        description: "",
        image: "",
        promo_video: "",
        video: "",
        category: "",
        level: "",
        language: "",
        duration: "",
        price: "",
        rating: "",
        instructor_id: "",
        creator:"",
      });

      setImageFile(null);
      setPromoVideoFile(null);
      setVideoFile(null);
    } catch (error) {
      console.error("Error adding course:", error);
      setSnackbarMessage("Faild to add course!!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            background: "#42a5f5",
            p: 2,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Add Course
          </Typography>
        </Box>
        <Box sx={{ mt: 3, p: 2 }} component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Course Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Title"
                variant="outlined"
                name="title"
                size="small"
                value={formData.title}
                required
                onChange={handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                variant="outlined"
                name="description"
                value={formData.description}
                size="small"
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                variant="outlined"
                size="small"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image", setImageFile)}
              />
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Course"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </Box>
              )}
            </Grid>

            {/* Promo Video Upload */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Promo Video URL"
                variant="outlined"
                size="small"
                name="promo_video"
                value={formData.promo_video}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleFileChange(e, "promo_video", setPromoVideoFile)
                }
              />
              {formData.promo_video && (
                <Box sx={{ mt: 2 }}>
                  <video width="250" height="150" controls>
                    <source src={formData.promo_video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
            </Grid>

            {/* Course Video Upload */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Video URL"
                variant="outlined"
                size="small"
                name="video"
                value={formData.video}
                onChange={handleChange}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "video", setVideoFile)}
              />
              {formData.video && (
                <Box sx={{ mt: 2 }}>
                  <video width="250" height="150" controls>
                    <source src={formData.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                variant="outlined"
                name="category"
                size="small"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Level */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Level"
                variant="outlined"
                name="level"
                size="small"
                value={formData.level}
                onChange={handleChange}
                required
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Language */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Language"
                variant="outlined"
                name="language"
                size="small"
                value={formData.language}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Duration */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (hours)"
                variant="outlined"
                name="duration"
                size="small"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                variant="outlined"
                name="price"
                size="small"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Rating */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Rating"
                variant="outlined"
                name="rating"
                size="small"
                value={formData.rating}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Instructor id"
                variant="outlined"
                name="instructor_id"
                size="small"
                value={formData.instructor_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Creator"
                variant="outlined"
                name="creator"
                size="small"
                value={formData.creator}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                size="small"
                type="submit"
              >
                Add Course
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={()=>setOpenSnackbar(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateCourse;
