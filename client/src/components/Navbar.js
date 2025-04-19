import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import "../styles/Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [librarian, setLibrarian] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLibrarian(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/user-dashboard")} style={{ cursor: "pointer" }}>
        Library App
      </div>

      <div className="nav-links">
        <Link to="/user-newarrivals" className="nav-link">New Arrivals</Link>
        <Link to="/user-allbooks" className="nav-link">All Books</Link>
      </div>

      {librarian && (
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="user-icon" />
            <span>{librarian.name}</span>
            <IoIosArrowDown className="dropdown-icon" />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
