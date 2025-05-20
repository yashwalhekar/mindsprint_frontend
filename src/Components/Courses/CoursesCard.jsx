
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  
} from "@mui/material";
const CourseCard = ({ course, onClick }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <>
      {/* Course Card */}
      <Card
        sx={{
          width:isMobile?230:200,
          height:isMobile?300:320,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
          borderRadius: "18px",
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={course.image_url}
          alt={course.title}
          sx={{ cursor: "pointer", objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h7"
            sx={{
              fontSize: 10,
              color: "white",
              border: "0.5px solid #02D1FF",
              bgcolor: "#02D1FF",
              borderRadius: 1,
            }}
          >
            Bestseller
          </Typography>
          <br />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontFamily: "jomolhari",
              fontSize: isMobile?"20px":"25px",
              textAlign: "center",
            }}
          >
            {course.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              fontFamily: "jomolhari",
              textAlign: "center",
              fontSize: isMobile?"15px":"20px",
            }}
          >
            {course.creator}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            variant="contained"
            sx={{ mt:isMobile?0:2 }}
            color="primary"
            fullWidth
            onClick={onClick}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default CourseCard;
