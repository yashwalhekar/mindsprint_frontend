import React, { useState } from "react";
import {
  Grid,
  TextField,
  Box,
  Button,
  Divider,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useRegisterUserMutation } from "./feature/authApi";
import { setUser } from "./feature/authSlice";
import { validationForm } from "../../utils/validationForm";

const SignUpForm = ({ toggleView }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    school: "",
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();  
  const[openSnackbar,setOpenSnackbar] =useState(false)
  const[snackbarMessage,setSnackbarMessage] = useState("");
  const[snackbarSeverity,setSnackbarSeverity] = useState("success")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validationForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await registerUser(formData).unwrap();
      dispatch(setUser({ user: formData, token: response.token }));

      setSnackbarMessage("Register user successfully...")
      setSnackbarSeverity("success");
      setOpenSnackbar(true)
      setFormData({ first_name: "",
        last_name: "",
        dob: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        school: "",});
    } catch (err) {
      console.error("Registration failed", err);
      setSnackbarMessage("Something went wrong,user registration failed")
      setSnackbarSeverity("error");
      setOpenSnackbar(true)
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "40%", sm: "80%", md: 600 },
          backgroundColor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          mt:{xs:5},
          p: { xs: 1, sm: 6, md: 4 },
          borderRadius: { xs: 2, sm: 4, md: 8 },
          boxShadow: 4,
          textAlign: "center",
          "@media (max-width:600px)": { maxWidth: "90%" },
        }}
      >
        <Box my={2}>
          <Typography variant="title" fontSize="25px" fontWeight="bold" fontFamily="jomolhari" >Registration form</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="first_name"
              value={formData.first_name}
              margin="normal"
              size="small"
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              error={!!errors.dob}
              helperText={errors.dob}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="School Name"
              name="school"
              value={formData.school}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              type="number"
              name="phone"
              value={formData.phone}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              error = {!!errors.phone}
              helperText = {errors.phone}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              value={formData.email}
              margin="normal"
              size="small"
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              variant="outlined"
              margin="normal"
              size="small"
              onChange={handleChange}
              error = {!!errors.password}
              helperText={errors.password}
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

        <Divider sx={{ bgcolor: "#bbdefb", fontWeight: 5, mt: 2 }} />

        <Button
          fullWidth
          variant="contained"
          sx={{
            my: 2,
            bgcolor: "linear-gradient(to right,rgb(61,126,255),rgb(37,75,153))",
            "&:hover": { bgcolor: "#1e88e5" },
          }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>

        <Typography variant="body2">
          Already have an account?{" "}
          <Link onClick={toggleView} underline="hover" sx={{ cursor: "pointer" }}>
            Log in
          </Link>
        </Typography>
      </Box>
      <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={()=>setOpenSnackbar(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
        onClose={()=>setOpenSnackbar(false)}
        severity={snackbarSeverity}
        variant="filled"
         >
        {snackbarMessage}
        </Alert>
        
      </Snackbar>

      {error && <p>Error: {error.data?.message || "Something went wrong"}</p>}
    </>
  );
};

export default SignUpForm;
