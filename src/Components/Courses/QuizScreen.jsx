import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSubmitAnswersApiMutation } from "../../Pages/Courses/feature/courseApi";
import { useSelector } from "react-redux";

const QuizScreen = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitAnswersApi] = useSubmitAnswersApiMutation();

  const currentQuestion = questions[currentQuestionIndex];
  const userId = useSelector((state) => state.auth.user?.user_id);

  if (!questions || questions.length === 0) {
    return <Typography>No quiz available.</Typography>;
  }

  const handleCheckboxChange = (option) => {
    const questionId = currentQuestion.questionId;
    const currentSelections = selectedOptions[questionId] || [];

    const isAlreadySelected = currentSelections.some(
      (opt) => opt.optionId === option.optionId
    );

    const updatedSelections = isAlreadySelected
      ? currentSelections.filter((opt) => opt.optionId !== option.optionId)
      : [...currentSelections, option];

    setSelectedOptions({
      ...selectedOptions,
      [questionId]: updatedSelections,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const quizId = currentQuestion.quizId;

   const answers = Object.entries(selectedOptions).map(
  ([questionId, selectedOpts]) => ({
    questionId: parseInt(questionId),
    selectedOptionId: selectedOpts[0]?.optionId,  // Only the first selected
  })
);

    console.log("Submitting payload:", {
      userId,
      quizId,
      answers,
    });

    const payload = { userId, quizId, answers };

    try {
      const response = await submitAnswersApi(payload).unwrap();
      console.log("API Response:", response);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ width: 500, p: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {currentQuestion.question}
          </Typography>

          <FormGroup>
            {currentQuestion.options.map((option) => (
              <FormControlLabel
                key={option.optionId}
                control={
                  <Checkbox
                    checked={
                      selectedOptions[currentQuestion.questionId]?.some(
                        (opt) => opt.optionId === option.optionId
                      ) || false
                    }
                    onChange={() => handleCheckboxChange(option)}
                    disabled={submitted}
                  />
                }
                label={option.optionText}
              />
            ))}
          </FormGroup>

          <Box mt={3} display="flex" justifyContent="space-between">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </Box>

          {submitted && (
            <Typography mt={3} color="green">
              Answers submitted! Check console for selected answers.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizScreen;
