import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/images/MindSprintLogo.jpg";
import { Avatar, Menu, MenuItem, Stack, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Pages/Auth/feature/authSlice";
import { useLogoutApiMutation } from "../../Pages/Auth/feature/authApi";

const Navbar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [explorAnchorEl, setExploreAnchorEl] = useState(null);
  const [avtarAnchorEl, setAvatarAnchorEl] = useState(null);
  const openExplore = Boolean(explorAnchorEl);
  const openAvtar = Boolean(avtarAnchorEl);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [logoutUser] = useLogoutApiMutation();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Courses", link: "/courses" },
    { text: "Cart", link: "/cart" },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await logoutUser(token).unwrap();
      dispatch(logout());
      navigate("/");
      console.log("Logout success:", response);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const handleExploreClick = (event) => {
  //   setExploreAnchorEl(event.currentTarget);
  // };

  // const handleExploreClose = () => {
  //   setExploreAnchorEl(null);
  // };

  const handleAvtarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvtarClose = () => {
    setAvatarAnchorEl(null);
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: 2,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isAuthPage ? (
            <Box component={Link} to="/">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: isMobile ? 30 : isTablet ? 35 : 40,
                  width: "auto",
                }}
              />
            </Box>
          ) : (
            <>
              {isMobile ? (
                <>
                  <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{ color: "black" }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box
                    component={Link}
                    to="/"
                    sx={{ flexGrow: 1, textAlign: "center" }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      style={{
                        height: isMobile ? 30 : isTablet ? 35 : 40,
                        width: "auto",
                      }}
                    />
                  </Box>

                  {isAuthenticated ? (
                    <>
                      <IconButton onClick={handleAvtarClick}>
                        <Avatar
                     
                          sx={{ bgcolor: "#8c3be3", fontSize: 9,width:30,height:30 }}
                        >
                          {user?.first_name[0].toUpperCase()}
                          {user?.last_name
                            ? user.last_name[0].toUpperCase()
                            : ""}
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={avtarAnchorEl}
                        open={openAvtar}
                        onClose={handleAvtarClose}
                      >
                        <MenuItem onClick={() => navigate("/userProfile")}>
                          Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <> </>
                  )}
                </>
              ) : (
                <>
                  <Box display="flex" alignItems="end" gap={3}>
                    <Box
                      component={Link}
                      to="/"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
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

                  <Box
                    sx={{
                      display: "flex",
                      gap: isTablet ? 1.5 : 3,
                      alignItems: "center",
                    }}
                  >
                    <Link to="/courses" style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "black",
                          // fontWeight: "bold",
                          fontFamily: "jomolhari",
                          fontSize: 18,
                          position: "relative",
                          display: "inline-block",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "0%",
                            height: "3px",
                            left: 0,
                            bottom: 0,
                            backgroundImage:
                              "linear-gradient(to right, rgb(105,241,243), rgb(81,209,109))",
                            transition: "width 0.3s ease",
                          },
                          "&:hover::after": {
                            width: "100%",
                          },
                        }}
                      >
                        Courses
                      </Typography>
                    </Link>

                    {/* Cart Link */}
                    <Link to="/cart" style={{ textDecoration: "none" }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          position: "relative",
                          width: "fit-content",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "0%",
                            height: "3px",
                            left: 0,
                            bottom: -2,
                            backgroundImage:
                              "linear-gradient(to right, rgb(105,241,243), rgb(81,209,109))",
                            transition: "width 0.3s ease",
                          },
                          "&:hover::after": {
                            width: "100%",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "black",
                            fontSize: 18,
                            // fontWeight: "bold",
                            fontFamily: "jomolhari",
                          }}
                        >
                          Cart
                        </Typography>
                        <ShoppingCartIcon sx={{ color: "black" }} />
                      </Stack>
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <IconButton onClick={handleAvtarClick}>
                          <Avatar
                            sizes="small"
                            sx={{ bgcolor: "#8c3be3", fontSize: 10 }}
                          >
                            {user?.first_name[0].toUpperCase()}
                            {user?.last_name
                              ? user.last_name[0].toUpperCase()
                              : ""}
                          </Avatar>
                        </IconButton>
                        <Menu
                          anchorEl={avtarAnchorEl}
                          open={openAvtar}
                          onClose={handleAvtarClose}
                        >
                          <MenuItem onClick={() => navigate("/userProfile")}>
                            Profile
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        component={Link}
                        to="/login"
                        sx={{ bgcolor: "#4281FF", fontSize: 10 }}
                      >
                        Login
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />
      <Divider
        sx={{
          height: "2px",
          background:
            "linear-gradient(to right, rgb(105,241,243), rgb(81,209,109))",
        }}
      />

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.link}
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider />
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
