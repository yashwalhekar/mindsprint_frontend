import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useDispatch, useSelector } from "react-redux";
import {
  useAddModuleMutation,
  useDeleteModuleMutation,
  useGetAllCoursesQuery,
  useGetAllModulesQuery,
  useGetCourseByIdQuery,
} from "../../features/adminApi";
import {
  addModules,
  deleteModule,
  setModules,
} from "../../features/adminSlice";

const Modules = () => {
  const { course_id } = useParams();
  const dispatch = useDispatch();
 

  const { data: modules } = useGetAllModulesQuery(course_id)||{};
  const modulesInStore = useSelector((state) =>
    state.admin.modules.filter(
      (module) => module.course_id === Number(course_id)
    )
  );
  const { data: courses } = useGetAllCoursesQuery();
  const filteredCourse = courses?.find(
    (course) => course.course_id == course_id
  );
  // console.log(filteredCourse?.title)

  useEffect(() => {
    if (modules) {
      dispatch(setModules(modules)); // Store fetched modules in Redux
    }
  }, [modules, dispatch]);

  const navigate = useNavigate();

  const [moduleName, setModuleName] = useState("");
  const [position, setPosition] = useState("");
  const { isLoading } = useGetCourseByIdQuery(course_id);
  const [addModule] = useAddModuleMutation();
  const [deleteModuleAPI] = useDeleteModuleMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleModuleClick = (course_id, module_id) => {
    navigate(`${module_id}/lectures`);
  };

  const handleAddModule = async () => {
    if (!moduleName.trim() || !position.trim()) return;
    try {
      const response = await addModule({
        title: moduleName,
        course_id: Number(course_id),
        position: Number(position),
      }).unwrap();

      dispatch(
        addModules({
          id: response.id,
          title: moduleName,
          position: Number(position),
          course_id: Number(course_id),
        })
      );
      setSnackbarMessage("Module added successfully!!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setModuleName("");
      setPosition("");
    } catch (error) {
   
      setSnackbarMessage("Faild to add module!!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteModule = async (course_id, module_id) => {
    try {
    
      console.log("module id",module_id)
      await deleteModuleAPI({ course_id, module_id }).unwrap();
      dispatch(deleteModule({ course_id, module_id }));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  return (
    <>
      <Box component={Paper} p={3} position="relative">
        {/* Back Button Positioned at Top-Right */}
        <IconButton
          onClick={() => navigate(-1)}
          color="primary"
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" color="secondary" sx={{ fontSize: "25px" }}>
          Moldules in {filteredCourse?.title || "Unknown Course"}
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <TextField
            label="Position"
            variant="outlined"
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            size="small"
          />
          <TextField
            label="Module Name"
            variant="outlined"
            fullWidth
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddModule}
          >
            <AddCircleIcon /> Add Module
          </Button>
        </Box>

        <List sx={{ mt: 3 }}>
          {isLoading ? (
            <Typography>Loading modules...</Typography>
          ) : modulesInStore.length > 0 ? (
            modulesInStore.map((module) => (
              <ListItem
                key={module.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "8px",
                }}
              >
                <Typography>
                  {module.title} (Position: {module.position})
                </Typography>
                <Box>
                  <IconButton color="primary" size="small">
                    <LibraryBooksIcon
                      onClick={() =>
                        handleModuleClick(module.course_id, module.module_id)
                      }
                    />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() =>
                      handleDeleteModule(module.course_id, module.module_id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography>No modules available.</Typography>
          )}
        </List>
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

export default Modules;
