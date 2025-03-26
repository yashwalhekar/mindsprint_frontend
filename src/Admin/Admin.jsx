import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Pages/Auth/feature/authSlice";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import logo from "../Assets/images/MindSprintLogo.jpg";

const drawerWidth = 240;

const Admin = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State for expanding "All Users"
  const [openUsers, setOpenUsers] = useState(false);
  const handleToggleUsers = () => {
    setOpenUsers(!openUsers);
  };

  // State for mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Avatar Menu State
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Drawer Content
  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin/dashboard" onClick={() => isMobile && handleDrawerToggle()}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* All Users with Sub-options */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleToggleUsers}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="All Users" />
            {openUsers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/users/viewdetails" onClick={() => isMobile && handleDrawerToggle()}>
                <ListItemText primary="View Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/users/add" onClick={() => isMobile && handleDrawerToggle()}>
                <ListItemText primary="Add User" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin/courses/" onClick={() => isMobile && handleDrawerToggle()}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="All Courses" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin/create-course" onClick={() => isMobile && handleDrawerToggle()}>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Create Course" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above the Drawer
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Show menu icon only on mobile */}
            {isMobile && (
              <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            {/* Logo */}
            <Box component={Link} to="/admin/dashboard" sx={{ textDecoration: "none" }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: isMobile ? 30 : isTablet ? 35 : 40,
                  width: "auto",
                }}
              />
            </Box>
          </Box>

          {/* Avatar & Dropdown Menu */}
          {isAuthenticated && (
            <>
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: "#4281FF", fontSize: 14 }}>
                  {user?.first_name?.[0]?.toUpperCase()}
                  {user?.last_name?.[0]?.toUpperCase() || ""}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={avatarAnchorEl}
                open={!!avatarAnchorEl}
                onClose={handleAvatarClose}
              >
                <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      {/* Temporary Drawer for Mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile.
          }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Permanent Drawer for larger screens
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar /> {/* This ensures content starts below the AppBar */}
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // Space for the AppBar
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Admin;
