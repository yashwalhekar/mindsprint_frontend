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
import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Pages/Auth/feature/authSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleExploreClick = (event) => {
    setExploreAnchorEl(event.currentTarget);
  };

  const handleExploreClose = () => {
    setExploreAnchorEl(null);
  };

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
          boxShadow: 1,
          borderBottom: "linear-gradient(to right, rgb(105,241,243), rgb(81,209,109))",
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
                </>
              ) : (
                <>
                  <Box display="flex" alignItems="center" gap={3}>
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

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ fontSize: 10 }}
                      onClick={handleExploreClick}
                    >
                      Explore <ArrowDropDownIcon />
                    </Button>

                    <Menu
                      anchorEl={explorAnchorEl}
                      open={openExplore}
                      onClose={handleExploreClose}
                      MenuListProps={{ "aria-labelledby": "basic-button" }}
                    >
                      <MenuItem
                        onClick={() => navigate("/courses")}
                        sx={{ fontSize: 12 }}
                      >
                        Courses
                      </MenuItem>
                    </Menu>
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
                          "&:hover": { color: "gray" },
                          fontWeight: "medium",
                          fontSize: 12,
                        }}
                      >
                        Courses
                      </Typography>
                    </Link>
                    <Link to={"/cart"} style={{ textDecoration: "none" }}>
                      <ShoppingCartIcon
                        sx={{
                          color: "#3D3D3E",
                          "& : hover": { color: "black" },
                        }}
                      />
                    </Link>
                    {isAuthenticated ? (
                      <>
                        <IconButton onClick={handleAvtarClick}>
                          <Avatar
                            sizes="small"
                            sx={{ bgcolor: "#4281FF", fontSize: 10 }}
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
                          <MenuItem>Profile</MenuItem>
                          <MenuItem onClick={handleLogout} navigate={"/"}>
                            Logout
                          </MenuItem>
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
          background: "linear-gradient(to right, rgb(105,241,243), rgb(81,209,109))",
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
