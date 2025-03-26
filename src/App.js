import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import routes from "./Routes/routes";
import Navbar from "./Components/NavBar2/Navbar";
import AdminRouter from "./Routes/AdminRouter";
import { useGetAllUsersQuery } from "./Admin/features/adminApi";
import { useSelector } from "react-redux";


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Separate Component to Use useLocation() & useNavigate()
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const user = useSelector((state)=>state.auth.user)


  useEffect(() => {
    if (user && user.role === "admin") {
      // Only redirect if NOT already inside an admin route
      if (!location.pathname.startsWith("/admin/")) {
        navigate("/admin/dashboard");
      }
    }
  }, [user, navigate, location.pathname]);
  
  

  // Hide Navbar when inside admin routes
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* General Routes */}
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </>
  );
};

export default App;
