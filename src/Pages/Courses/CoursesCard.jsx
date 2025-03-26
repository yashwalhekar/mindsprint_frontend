import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { useEnrollUserMutation } from "../Enrollment/feature/enrollmentApi";
import { useSelector } from "react-redux";
const CourseCard = ({ course,onClick,onEnroll,isEnrolled }) => {
  return (
    <>
      {/* Course Card */}
      <Card
        sx={{
          width:280,
          height:350,
          boxShadow: 3,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
        }}
        onClick={onClick}
      >
        {/* Clickable Image to Open Video Modal */}
        <CardMedia
          component="img"
          height="140"
          image={course.image_url}
          alt={course.title}
          sx={{ cursor: "pointer" }} // Makes it clickable
        />

        <CardContent>
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
          <Typography variant="h6" sx={{ fontWeight: "bold",fontFamily:"jomolhari",fontSize:"25px",textAlign:"center" }}>
            {course.title}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" ,fontFamily:"jomolhari",textAlign:"center",fontSize:"20px"}}>
            {course.creator}
          </Typography>
        </CardContent>

        <CardActions>
          <Button size="small" variant="contained" sx={{mt:3}} color="primary" fullWidth onClick={()=>onEnroll(course.course_id)}>
           {isEnrolled? "Enrolled":"Enroll Now"}
          </Button>
        </CardActions>
      </Card>

     
    
    </>
  );
};

export default CourseCard;
