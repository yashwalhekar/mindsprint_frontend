import React, { useState } from "react";
import { useGetEnrolledCourseByUsersApiQuery } from "../../../Pages/Enrollment/feature/enrollmentApi";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const EnrolledUsers = () => {
  const { data: users } = useGetEnrolledCourseByUsersApiQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered Users
  const filteredUsers = users?.data?.filter((user) => {
    const fullName = `${user.first_name}${user.last_name}`.replace(/\s+/g, "").toLowerCase();
    const courseName = user.course_name.replace(/\s+/g, "").toLowerCase();
    const search = searchTerm.replace(/\s+/g, "").toLowerCase();
    return fullName.includes(search) || courseName.includes(search);
  });

  return (
    <>
      <Box component={Paper} sx={{ p: 2 }}>
        <Box>
          <Typography variant="h5" sx={{textAlign:"center",mb:2,fontWeight:"bold",fontStyle:"jomolhari"}}>Users Course</Typography>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search.."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          size="small"
        />
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#44d5f2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr No</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>User Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Enrolled Courses</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Enrollment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers?.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.course_name}</TableCell>
                  <TableCell>
                    {new Date(user.enrollment_date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default EnrolledUsers;
