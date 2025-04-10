import React from "react";
import HomeCarousel from "../../Components/HomeCarousel";
import { Box, Button, Grid, Typography } from "@mui/material";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import img3 from "../../Assets/images/img5.jpg";
import Footer from "../../Components/Footer";

const HomePage = () => {
  const dummyData = [
    {
      icon: <AdsClickIcon sx={{ color: "red" }} />,
      heading: "Explore New Skills",
      content: `Access 10,000+ courses in AI, business, technology, and more`,
    },
    {
      icon: <LocalLibraryIcon sx={{ color: "blue" }} />,
      heading: "Learn From Experts",
      content: `Get Certificate for every course you finish and boost your chances to get hired .`,
    },
    {
      icon: <WorkspacePremiumIcon sx={{ color: "orange" }} />,
      heading: "Certifications",
      content: `Earn certifications to showcase your skills.`,
    },
  ];

  return (
    <>
      <Box marginTop={3}>
        <HomeCarousel />
      </Box>

      <Box p={3}>
        <Typography
          variant="h6"
          fontSize={20}
          sx={{ textAlign: "center",bgcolor:"#9275B3",color:"white",p:1,borderRadius:2}}
          fontWeight={"semi-bold"}
          fontFamily={"jomolhari"}
        >
          "A healthy mind builds a happy future. Let’s nurture their mental
          well-being today!
        </Typography>
      </Box>

      <Box mt={4} p={2} sx={{backgroundImage:"linear-gradient(to right,rgb(217, 238, 238), #AFE5E5)",borderTopLeftRadius:"26px",borderTopRightRadius:"26px",} }>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={4}
          sx={{ display: "flex", justifyContent: "center",}}
          fontFamily={"jomolhari"}
        >
          Invest in Your Growth
        </Typography>

        <Grid container spacing={4}>
          {dummyData.map((data, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Use the icon from the data */}
              <div style={{ fontSize: "60px", marginBottom: "10px" }}>
                {data.icon}
              </div>
              {/* Use the heading from the data */}
              <Typography
                variant="h6"
                fontSize={20}
                fontWeight="bold"
                sx={{ textAlign: "center", marginBottom: "8px" }}
                fontFamily={"jomolhari"}
              >
                {data.heading}
              </Typography>
              {/* Use the content from the data */}
              <Typography
                variant="subtitle1"
                fontSize="14px"
                sx={{ textAlign: "center" }}
              >
                {data.content}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={3} p={2}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }} 
          justifyContent="space-between"
          alignItems="center"
          sx={{  backgroundImage:"linear-gradient(to bottom,rgb(217, 243, 243), #AFE5E5)",borderTopLeftRadius:"26px",borderTopRightRadius:"26px"}}
          width={"100%"}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: { xs: "80%", md: "50%" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                ml: 4,
                fontSize: 20,
                fontWeight: "bold",
                fontFamily:"jomolhari"
              }}
              textAlign="center"
            >
              Your Children are Your responsibility, So make your child mentally
              strong.
            </Typography>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button variant="outlined" color="primary">
                Get Your First Course
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-center" },
              alignItems: "center",
              width: { xs: "100%", md: "45%" },
              mt: { xs: 2, md: 0 },
              p:3
            }}
          >
            <img
              src={img3}
              alt="image 4"
              style={{
                width: "100%",
                maxWidth: "250px", // Restrict max width for smaller screens
                height: "auto", // Maintain aspect ratio
                borderRadius: "8px",
                boxShadow: "0px 4px 10px gray", // Updated shadow style
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Add the Footer component here */}
      <Footer />
    </>
  );
};

export default HomePage;
