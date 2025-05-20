// ModuleAccordion.jsx
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LessonWithQuiz from "../LessonswithQuiz";
import { useGetLessonsQuery } from "../../../Pages/Courses/feature/courseApi";


const ModuleAccordion = ({ module, course_id, onPlayVideo, onPlayQuiz }) => {
  const { data: lessons = [] } =
    useGetLessonsQuery({
      course_id,
      module_id: module.module_id,
    }) || {};

  return (
    <Accordion sx={{ mt: 1, width: "110%" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{module.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {lessons.map((lesson) => (
          <LessonWithQuiz
            key={lesson.lesson_id}
            lesson={lesson}
            course_id={course_id}
            module_id={module.module_id}
            onPlayVideo={onPlayVideo}
            onPlayQuiz={onPlayQuiz}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleAccordion;
