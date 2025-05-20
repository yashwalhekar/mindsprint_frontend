// LessonWithQuiz.jsx
import { Box, IconButton, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useGetQuizApiQuery } from "../../Pages/Courses/feature/courseApi";
import QuizIcon from "@mui/icons-material/Quiz";

const LessonWithQuiz = ({
  lesson,
  course_id,
  module_id,
  onPlayVideo,
  onPlayQuiz,
}) => {
  const { data: quizData } =
    useGetQuizApiQuery({
      course_id,
      module_id,
      lesson_id: lesson.lesson_id,
    }) || {};
  console.log("quiz", quizData);
  return (
    <Box sx={{ pl: 2, mb: 1 }}>
      <Box display="flex" alignItems="center">
        <IconButton
          color="primary"
          onClick={() =>
            onPlayVideo(
              lesson.content_url,
              lesson.title,
              module_id,
              lesson.lesson_id
            )
          }
        >
          <PlayCircleOutlineIcon />
        </IconButton>
        <Typography>{lesson.title}</Typography>
      </Box>

      {quizData?.data?.lectureId === lesson.lesson_id && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pl: 2,
            cursor: "pointer",
            mt: 0.5,
          }}
          onClick={() => onPlayQuiz(quizData.data, module_id, lesson.lesson_id)}
        >
          <QuizIcon sx={{ color: "blue", mr: 1 }} />
          <Typography sx={{textDecoration: "none" }}>
            {quizData.data.title}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LessonWithQuiz;
