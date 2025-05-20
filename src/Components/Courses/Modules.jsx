// Modules.jsx
import { Box } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetModulesQuery } from "../../Pages/Courses/feature/courseApi";
import ModuleAccordion from "./module/ModuleAccordion";


const Modules = ({ onPlayVideo, onPlayQuiz }) => {
  const { course_id } = useParams();
  const { data: modules } = useGetModulesQuery(course_id) || {};

  const filteredModules =
    modules?.filter(
      (module) => String(module.course_id) === String(course_id)
    ) || [];

  return (
    <Box p={2}>
      {filteredModules.map((module) => (
        <ModuleAccordion
          key={module.module_id}
          module={module}
          course_id={course_id}
          onPlayVideo={onPlayVideo}
          onPlayQuiz={onPlayQuiz}
        />
      ))}
    </Box>
  );
};

export default Modules;
