import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useAddUserNotesApiMutation,
  useGetUserNotesApiQuery,
} from "../../../Pages/Courses/feature/courseApi";

const UserNote = ({ moduleId, lessonId }) => {
  const { course_id } = useParams();
  const user_id = useSelector((state) => state.auth.user.user_id) || {};

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);

  // RTK Query Hooks
  const [addUserNote, { isLoading: adding, error: addError }] =
    useAddUserNotesApiMutation();
  const {
    data: userNotes,
    error: fetchError,
    isLoading: fetching,
  } = useGetUserNotesApiQuery({
    course_id,
    module_id: moduleId,
    lesson_id: lessonId,
    user_id,
  });

  console.log("Fetched Notes:", userNotes);

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      await addUserNote({
        course_id,
        module_id: moduleId,
        lesson_id: lessonId,
        notes: { user_id, title, content },
      }).unwrap();

      alert("Note added successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note. Please try again.");
    }
  };

  const notes = userNotes?.data || [];

  // ✅ Ensure sorting uses `created_at` correctly
  const sortedNotes = [...notes].sort((a, b) =>
    a.created_at && b.created_at
      ? new Date(b.created_at) - new Date(a.created_at)
      : 0
  );

  const latestNotes = sortedNotes.slice(0, 5);

  return (
    <Box>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Write here.."
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNote}
        disabled={adding}
      >
        {adding ? "Adding..." : "Add Notes"}
      </Button>

      {addError && (
        <Typography color="error">Error: {addError.message}</Typography>
      )}

      {/* Display User Notes */}
      <Box mt={4}>
        <Typography variant="h6">Your Notes</Typography>
        {fetching ? (
          <CircularProgress />
        ) : fetchError ? (
          <Typography color="error">No notes available.</Typography>
        ) : notes.length === 0 ? (
          <Typography>No notes available.</Typography>
        ) : (
          <>
            {(showAllNotes ? sortedNotes : latestNotes).map((note) => (
              <Paper
                key={note.note_id}
                sx={{ p: 2, mt: 1, backgroundColor: "#f5f5f5" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {note.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {note.created_at
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(new Date(note.created_at))
                    : "No date available"}
                </Typography>
                <Typography>{note.content}</Typography>
              </Paper>
            ))}
            {notes.length > 5 && !showAllNotes && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setShowAllNotes(true)}
              >
                See Previous Notes
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserNote;
