import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import UserDashboard from "./pages/user-dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={!localStorage.getItem("token") ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!localStorage.getItem("token") ? <SignupPage /> : <Navigate to="/" />} />

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

      </Routes>
    </Router>
  );
}

export default App;
