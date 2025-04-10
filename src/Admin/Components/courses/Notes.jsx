import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useCreateNotesApiMutation } from "../../features/adminApi"; // update this path as per your project
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const Notes = () => {
  const { course_id, module_id, lesson_id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("text");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const [createNote, { isLoading }] = useCreateNotesApiMutation();
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedFileUrl = fileUrl;

    // Simulate file upload if file is selected
    if (file) {
      // Normally you would upload the file to a storage service like Firebase/S3
      // Here's a placeholder for that
      uploadedFileUrl = URL.createObjectURL(file); // For testing only, not for production use
    }

    const notes = {
      course_id,
      module_id,
      lesson_id,
      title,
      content,
      fileUrl: uploadedFileUrl,
      noteType,
    };

    try {
      const res = await createNote({
        course_id,
        module_id,
        lesson_id,
        notes,
      }).unwrap();
      console.log("Note added successfully", res);
      alert("Note added successfully");
      setTitle("");
      setContent("");
      setFile(null);
      setFileUrl("");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Typography variant="h6" gutterBottom>
        Add Notes
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />

        <TextField
          label="Note Type"
          select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
          fullWidth
          required
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="image">Image</MenuItem>
        </TextField>

        <Box>
          <Typography variant="subtitle2">Upload File (optional):</Typography>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
          />
        </Box>

        {/* Preview Section */}
        {file && (
          <Box mt={2}>
            <Typography variant="subtitle2">Preview:</Typography>
            {noteType === "image" ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            ) : noteType === "pdf" ? (
              <iframe
                src={URL.createObjectURL(file)}
                title="PDF Preview"
                width="100%"
                height="300px"
                style={{ border: "1px solid #ccc", borderRadius: 8 }}
              ></iframe>
            ) : null}
          </Box>
        )}

        <TextField
          label="File URL (optional if file uploaded)"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Note"}
        </Button>
      </Stack>
    </Box>
  );
};

export default Notes;
