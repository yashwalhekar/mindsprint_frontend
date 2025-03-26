import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetLessonsQuery, useGetModulesQuery } from '../../Pages/Courses/feature/courseApi';
import { useParams } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Modules = ({ onPlayVideo }) => {
  const { course_id } = useParams();
  const { data: modules } = useGetModulesQuery();
  const filteredModules = modules?.filter((module) => String(module.course_id) === String(course_id)) || [];
  const module_id = filteredModules.length > 0 ? filteredModules[0].module_id : null;
  const { data: lessons } = useGetLessonsQuery({ course_id, module_id });

  return (
    <Box p={3}>
      {filteredModules.map((module) => (
        <Accordion key={module.module_id} sx={{ mt: 1 ,width:"110%"}}> 
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{module.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {lessons &&
              lessons
                .filter((lesson) => String(lesson.module_id) === String(module.module_id))
                .map((lesson) => (
                  <Box key={lesson.lesson_id} display="flex" alignItems="center" sx={{ pl: 2 }}>
                    <IconButton 
                      color="primary"
                      onClick={() => onPlayVideo(lesson.content_url, lesson.title)} // Update VideoScreen
                    >
                      <PlayCircleOutlineIcon />
                    </IconButton>
                    <Typography>{lesson.title}</Typography>
                  </Box>
                ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Modules;
