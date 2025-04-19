import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBook, FaShoppingCart } from "react-icons/fa";
import "../styles/Sidebar.css"; // Import custom styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/home/dashboard" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <FaTachometerAlt className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/home/members" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <FaUsers className="sidebar-icon" />
            <span>Members</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/home/add-books" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <FaBook className="sidebar-icon" />
            <span>Add Books</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/home/check-out" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            <FaShoppingCart className="sidebar-icon" />
            <span>Check-Out</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
