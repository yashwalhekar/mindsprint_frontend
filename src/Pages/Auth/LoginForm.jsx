import React, { useState } from "react";
import {
  Grid,
  TextField,
  Box,
  Button,
  Divider,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useLoginUserMutation } from "./feature/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, setUser } from "./feature/authSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const LoginForm = ({ toggleView }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await loginUser(formData);

    if (data?.token && data?.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); 
      dispatch(login({ user: data.user, token: data.token }));

      // Redirect immediately after login
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setErrorMessage("Invalid credentials, please try again.");
    }
  } catch (err) {
    console.error("Login Error:", err);
    setErrorMessage("Login failed. Please check your details.");
  }
};

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "50%", sm: "80%", md: 400 },
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
        p: { xs: 1, sm: 6, md: 10 },
        borderRadius: { xs: 2, sm: 4, md: 8 },
        boxShadow: 3,
        textAlign: "center",
        "@media (max-width:600px)": { maxWidth: "90%" },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            type="email"
            variant="outlined"
            margin="normal"
            size="small"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            name="password"
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            size="small"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Divider sx={{ bgcolor: "#bbdefb", fontWeight: 5, mt: 2 }} />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{
          my: 2,
          bgcolor: "linear-gradient(to right,rgb(61,126,255),rgb(37,75,153))",
          "&:hover": { bgcolor: "#1e88e5" },
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{ mb: 2, background: "#2E2F2F", color: "white" }}
      >
        Sign in With Google
      </Button>

      <Typography variant="body2">
        Don't have an account?{" "}
        <Link onClick={toggleView} underline="hover" sx={{ cursor: "pointer" }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
