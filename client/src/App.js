import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import UserDashboard from "./pages/user-dashboard";
import NewArrivals from "./pages/NewArrivals";
import AllBooks from "./pages/AllBooks";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/home/*"
          element={
            <PrivateRoute allowedRoles={["librarian"]}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-allbooks"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <AllBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-newarrivals"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <NewArrivals />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
