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
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";

import { useAddNewUserMutation } from "../../features/adminApi";
import { addUser } from "../../features/adminSlice";

const AddUser = ({ toggleView }) => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snacbarSeverity, setSnackbarSeverity] = useState("success");

  const dispatch = useDispatch();
  const [addNewUser, { isLoading, error }] = useAddNewUserMutation();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addNewUser(formData).unwrap();
      console.log("Api Response", response);

      // Dispatch the new user data
      dispatch(addUser(response)); // Assuming response contains the newly added user details

      setSnackbarMessage("User Added successfully!!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Reset the form after successful submission
      setFormData({
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
    } catch (err) {
      console.error("Registration failed", err);
      setSnackbarMessage("Faild to add user...!!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: "#42a5f5",
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
          ADD USERS
        </Typography>
      </Box>
      <Box sx={{ p: 3, mt: 2 }} component={Paper}>
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
          Register
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snacbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {error && <p>Error: {error.data?.message || "Something went wrong"}</p>}
    </>
  );
};

export default AddUser;
