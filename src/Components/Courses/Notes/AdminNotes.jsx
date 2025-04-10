import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import React from "react";
import { useGetAdminNotesAdminQuery } from "../../../Admin/features/adminApi";
import { useParams } from "react-router-dom";

const AdminNotes = ({ moduleId, lessonId }) => {
  const { course_id } = useParams();
  const courseId = parseInt(course_id);

  const { data } = useGetAdminNotesAdminQuery({
    course_id: courseId,
    module_id: moduleId,
    lesson_id: lessonId,
  }) || {};

  const notes = data?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          fontFamily="Jomolhari"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Admin Notes
        </Typography>

        <Grid container direction="column" spacing={2}>
          {notes.map((note, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                 display:"flex",
                 flexDirection:{xs:"column",sm:"row"},
                 alignItems:"flex-start",
                 border:"1px solid #ddd",
                 p:2,
                 gap:2,
                 borderRadius:2

                 
                }}
              >
                {/* Preview section */}
                <Box sx={{ flex: "1 1 40%" }}>
                  {note.note_type === "image" && note.file_url && (
                    <>
                    <img
                      src={note.file_url}
                      alt="Note"
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                   
                  </>
                  )}

                  {note.note_type === "pdf" && note.file_url && (
                    <Typography variant="body2">
                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                      }}
                    >
                      Open PDF in new tab
                    </a>
                  </Typography>
                  )}
                </Box>

                {/* Info section */}
                <Box sx={{ flex: "1 1 60%" }}>
                  <Typography variant="h6" fontWeight="bold" fontFamily="Jomolhari">
                    {note.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" fontFamily="Jomolhari">
                    Type: {note.note_type}
                  </Typography>
                  {note.content && (
                    <Typography variant="body2" sx={{ mt: 1 }} fontFamily="Jomolhari">
                      {note.content}
                    </Typography>
                  )}
                </Box>
              </Box>

              {index < notes.length - 1 && <Divider sx={{ my: 2 }} />}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminNotes;
