import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Import the custom CSS


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Try librarian login first
      const res = await axios.post("http://localhost:5000/api/auth/librarian/login", formData);
      const user = res.data.librarian;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "librarian");
      navigate("/home");
    } catch (librarianErr) {
      try {
        // Fallback to user login
       // Fallback to user login
const res = await axios.post("http://localhost:5000/api/auth/user/login", formData);
const user = res.data.user;
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("userId", user.id); // ✅ Add this line
localStorage.setItem("role", "user");
navigate("/user-dashboard");

      } catch (userErr) {
        setError(userErr.response?.data?.message || "Invalid credentials");
      }
    }
  };

  return (
    <>

    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="login-signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div> </>
  );
};

export default Login;
