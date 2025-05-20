import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import {
  useAddNewQuestionApiMutation,
  useGetAllCoursesQuery,
  useGetAllLessonsQuery,
  useGetAllModulesQuery,
} from "../../features/adminApi";

const CourseQuestions = () => {
  const [course_id, setCourseId] = useState("");
  const [module_id, setModuleId] = useState("");
  const [lesson_id, setLessonId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [marks, setMarks] = useState("");
  const [srNo, setSrNo] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const { data, isLoading, isError } = useGetAllCoursesQuery();
  const courses = data || [];

  const { data: modules = [] } = useGetAllModulesQuery(course_id) || {};
  const { data: lessons } =
    useGetAllLessonsQuery({ course_id, module_id }) || {};

  const [addQuestion] = useAddNewQuestionApiMutation();

  const handleOptionChange = (label, value) => {
    setOptions((prev) => ({ ...prev, [label]: value }));
  };

  const handleCorrectAnswerChange = (label) => {
    setCorrectAnswers((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleAddQuestion = () => {
    const formattedOptions = Object.entries(options).map(([key, value]) => ({
      optionText: value,
      isCorrect: correctAnswers.includes(key),
    }));

    const newQuestion = {
      question: questionText,
      category,
      difficulty,
      questionNumber: Number(srNo),
      options: formattedOptions,
    };

    setQuizQuestions((prev) => [...prev, newQuestion]);

    console.log("Added Question:", newQuestion);

    // Clear input fields after adding
    setSrNo("");
    setQuestionText("");
    setOptions({ A: "", B: "", C: "", D: "" });
    setCorrectAnswers([]);
  };

  const handleSubmitQuiz = async () => {
    if (quizQuestions.length === 0) {
      alert("Please add at least one question!");
      return;
    }

    const newQuiz = {
      courseId: Number(course_id),
      moduleId: Number(module_id),
      lectureId: Number(lesson_id),
      title: "Test for Lecture", // Optional: add input for title if you want
      questions: quizQuestions,
    };

    const result = await addQuestion(newQuiz);

    console.log("Submitted Quiz:", result);

    // Clear all after submit
    setQuizQuestions([]);
    setDifficulty("")
    setCategory("")
    setCourseId("")
    setModuleId("")
    setLessonId("")
    setMarks("")
    
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" mb={2}>
        Add Questions
      </Typography>

      <Box component={Paper} sx={{ p: 3, width: "94%" }}>
        {/* Dropdown Row */}
        <Grid container spacing={2} mb={4}>
          {/* Course */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Course</InputLabel>
              <Select
                value={course_id}
                label="Course"
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((item) => (
                  <MenuItem key={item.course_id} value={item.course_id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Module */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Module</InputLabel>
              <Select
                value={module_id}
                label="Module"
                onChange={(e) => setModuleId(e.target.value)}
              >
                {modules?.map((item) => (
                  <MenuItem key={item.module_id} value={item.module_id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Lesson */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Lesson</InputLabel>
              <Select
                value={lesson_id}
                label="Lesson"
                onChange={(e) => setLessonId(e.target.value)}
              >
                {lessons?.map((item) => (
                  <MenuItem key={item.lesson_id} value={item.lesson_id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Difficulty */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Single Choice">
                  Single Choice Question
                </MenuItem>
                <MenuItem value="Multiple Choice">
                  Multiple Choice Question
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Marks */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Marks</InputLabel>
              <Select
                value={marks}
                label="Marks"
                onChange={(e) => setMarks(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 10].map((mark) => (
                  <MenuItem key={mark} value={mark}>
                    {mark}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Questions Section */}
      <Box sx={{ mt: 4 }}>
        <Box component={Paper} sx={{ border: "1px solid #ccc", borderRadius: 2, p: 3 }}>
          {/* SR No */}
          <TextField
            label="SR No"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            value={srNo}
            onChange={(e) => setSrNo(e.target.value)}
          />

          {/* Question */}
          <TextField
            label="Question"
            multiline
            minRows={3}
            fullWidth
            sx={{ mb: 2 }}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          {category === "Multiple Choice" && (
            <Grid container spacing={2}>
              {["A", "B", "C", "D"].map((label) => (
                <Grid item xs={12} sm={6} md={12} key={label}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <FormControlLabel
                        label={label}
                        control={
                          <Checkbox
                            checked={correctAnswers.includes(label)}
                            onChange={() => handleCorrectAnswerChange(label)}
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs>
                      <TextField
                        label={`Option ${label}`}
                        size="small"
                        fullWidth
                        value={options[label]}
                        onChange={(e) =>
                          handleOptionChange(label, e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleAddQuestion}
              sx={{mr:2}}
            >
              Add Question
            </Button>

            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseQuestions;
