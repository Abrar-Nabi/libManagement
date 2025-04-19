import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/user-dashboard" className="footer-link">Dashboard</Link>
        <Link to="/user-newarrivals" className="footer-link">New Arrivals</Link>
        <Link to="/user-allbooks" className="footer-link">All Books</Link>
      </div>
      <div className="footer-right">
        <p>&copy; {new Date().getFullYear()} Library App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
