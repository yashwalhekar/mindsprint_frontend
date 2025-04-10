import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      mt={5}
      bgcolor="#00695c"
      color="white"
      p={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Connect with Us
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Link href="https://facebook.com" color="inherit">
            <FacebookIcon fontSize="large" />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://twitter.com" color="inherit">
            <TwitterIcon fontSize="large" />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://instagram.com" color="inherit">
            <InstagramIcon fontSize="large" />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://linkedin.com" color="inherit">
            <LinkedInIcon fontSize="large" />
          </Link>
        </Grid>
      </Grid>

      <Typography variant="body2" mt={3} textAlign="center">
        © 2025 All Rights Reserved | MINDMED INNOVATION PVT.LTD
      </Typography>
    </Box>
  );
};

export default Footer;
