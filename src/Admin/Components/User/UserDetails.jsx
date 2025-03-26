import React, { useEffect, useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "../../features/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUsers } from "../../features/adminSlice";

const ViewUsers = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPages, setRowsPerPages] = useState(10);
  const [selectedUser, setSelectedUser] = useState();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsChangePerPage = (e) => {
    setRowsPerPages(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEnroll = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    try {
      await updateUserStatus({ id: user.id, status: newStatus }).unwrap();
      console.log("User status updated successfully");
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  useEffect(()=>{
    if(users){
      dispatch(setUsers(users))
    }
  },[users,dispatch])

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Failed to load users. Please try again.
      </Typography>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No users found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 2,
          bgcolor: "#64b5f6",
          color: "white",
          borderRadius: 1,
          p: 3,
        }}
      >
        USER LIST
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#64b5f6" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Sr No</TableCell>
              <TableCell sx={{ color: "white" }}>User Id</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Date of Birth</TableCell>
              <TableCell sx={{ color: "white" }}>Phone Number</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Country</TableCell>
              <TableCell sx={{ color: "white" }}>City</TableCell>
              <TableCell sx={{ color: "white" }}>State</TableCell>
              <TableCell sx={{ color: "white" }}>School</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
              <TableCell sx={{ color: "white" }}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPages, page * rowsPerPages + rowsPerPages)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>
                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>{user.school}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color={user.status === "Active" ? "error" : "success"}
                      onClick={() => handleEnroll(user)}
                    >
                      {user.status === "Active" ? "Deactivate" : "Enroll"}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => handleView(user)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPages}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsChangePerPage}
        />
      </TableContainer>

      {/* Dialog for user Details */}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
                Name: {selectedUser.first_name} {selectedUser.last_name}
              </Typography>

              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Created At:{" "}
                {new Date(selectedUser.created_at).toLocaleDateString()}
              </Typography>

              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Date of Birth: {selectedUser.dob}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Phone Number: {selectedUser.phone}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Country: {selectedUser.country}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                State: {selectedUser.state}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                City: {selectedUser.city}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                Address: {selectedUser.address}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                School Name: {selectedUser.school}
              </Typography>
              <Typography variant="h6" fontSize={11} fontWeight={"bold"}>
                is Active: {selectedUser.is_active}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewUsers;
