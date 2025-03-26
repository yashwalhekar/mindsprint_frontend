import React, { useState } from "react";
import { Box } from "@mui/material";
import img from "../../Assets/images/mind_logo.png";
import Footer from "../Home/Footer";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleView = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <>
      <Box
        sx={{
          height: {
            xs: isSignIn ? "100vh" : "190vh",
            md: isSignIn ? "100vh" : "150vh",
          },
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: isSignIn ? { xs: "100%", sm: "90%", md: "82%" } : "100%",
            height: "100%",
            backgroundImage: `url(${img})`,
            backgroundSize: {
              xs: "40%",
              sm: "35%",
              md: isSignIn ? "31%" : "35%",
            },
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.5,
            zIndex: -1,
          },
        }}
      >
        {isSignIn ? <LoginForm toggleView={toggleView} /> : <SignUpForm toggleView={toggleView} />}
      </Box>
      <Footer />
    </>
  );
};

export default Login;
