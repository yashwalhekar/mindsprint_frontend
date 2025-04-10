import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetLessonsQuery, useGetModulesQuery } from '../../Pages/Courses/feature/courseApi';
import { useParams } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { skipToken } from '@reduxjs/toolkit/query/react';

const Modules = ({ onPlayVideo }) => {
  const { course_id } = useParams();
  console.log("course id",course_id);
  
  const { data: modules } = useGetModulesQuery(course_id)||{};
  console.log("Modules",modules)
  const filteredModules = modules?.filter((module) => String(module.course_id) === String(course_id)) || [];
  const module_id = filteredModules.length > 0 ? filteredModules[0].module_id : null;
  console.log("ModuleId in modulesjsx",module_id)
  const { data: lessons = [] } = useGetLessonsQuery(
    module_id ? { course_id, module_id } : skipToken // Prevents API call if `module_id` is null
  ) || {};

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
                      onClick={() => onPlayVideo(lesson.content_url, lesson.title,module.module_id,lesson.lesson_id)} // Update VideoScreen
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
