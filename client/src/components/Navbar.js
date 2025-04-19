import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

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
  <NavLink
    to="/user-newarrivals"
    className={({ isActive }) =>
      isActive ? "nav-link active-link" : "nav-link"
    }
  >
    New Arrivals
  </NavLink>
  <NavLink
    to="/user-allbooks"
    className={({ isActive }) =>
      isActive ? "nav-link active-link" : "nav-link"
    }
  >
    All Books
  </NavLink>
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
