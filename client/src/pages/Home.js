import { Routes, Route, Navigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import Members from "./Members";
import AddBooks from "./AddBooks";
import CheckOutBooks from "./CheckOutBooks";
import "../styles/home.css";
const Home = () => {
  return (
    <div>
      <AdminNavbar/>
      <div className="home-container">
        <Sidebar />
        <div className="content">
          <Routes>
            {/* Default to dashboard when visiting "/home" */}
            <Route path="/" element={<Navigate to="/home/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/add-books" element={<AddBooks />} />
            <Route path="/check-out" element={<CheckOutBooks />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
