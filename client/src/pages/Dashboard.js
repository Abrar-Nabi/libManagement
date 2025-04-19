import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { FaBook, FaUserFriends, FaCheckCircle, FaBookOpen } from "react-icons/fa";

import "../styles/Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const LibrarianDashboard = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    name: "",
    author: "",
    genre: "",
    language: "",
    totalCopies: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [userRes, bookRes, checkoutRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/books"),
        axios.get("http://localhost:5000/api/checkout"),
      ]);

      setUsers(userRes.data);
      setBooks(bookRes.data);
      setCheckouts(checkoutRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post("http://localhost:5000/api/books/add", bookForm);
      setShowModal(false);
      fetchData();
      setBookForm({ name: "", author: "", genre: "", language: "", totalCopies: "" });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const rentPerDay = 10;
  const activeBorrowings = checkouts.filter(c => !c.returned);

  const totalRevenue = checkouts.reduce((sum, c) => {
    if (c.returned && c.returnDate) {
      const days = calculateDays(c.createdAt, c.returnDate);
      return sum + days * rentPerDay;
    }
    return sum;
  }, 0);

  const totalAvailable = books.reduce((acc, b) => acc + (b.totalCopies - b.borrowedCopies), 0);
  const totalBorrowed = books.reduce((acc, b) => acc + b.borrowedCopies, 0);

  const pieData = {
    labels: ["Available Copies", "Borrowed Copies"],
    datasets: [{
      label: "Books",
      data: [totalAvailable, totalBorrowed],
      backgroundColor: ["#4CAF50", "#F44336"]
    }]
  };

  return (
    
    <div className="librarian-dashboard">
       <div className="actions">
      <span>Quick actions : </span>  <button onClick={() => setShowModal(true)}>Add Book</button>
      </div>

      <h2>Welcome admin</h2>

 <div className="overview-cards">
  <div className="dashboard-card yellow">
    <FaBook className="dashboard-icon" />
    <div className="count">{books.length}</div>
    <p>Total Books</p>
  </div>
  <div className="dashboard-card purple">
    <FaBookOpen className="dashboard-icon" />
    <div className="count">{activeBorrowings.length}</div>
    <p>Borrowed Copies</p>
  </div>
  <div className="dashboard-card blue">
    <FaCheckCircle className="dashboard-icon" />
    <div className="count">{totalAvailable}</div>
    <p>Available Copies</p>
  </div>
  <div className="dashboard-card green">
    <FaUserFriends className="dashboard-icon" />
    <div className="count">{users.length}</div>
    <p>Total Members</p>
  </div>
</div>


   

      <h3>Recently Borrowed Books</h3>
      {activeBorrowings.length === 0 ? (
        <p>No active borrowings.</p>
      ) : (
        <table className="Dashboard-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Checkout Date</th>
              <th>Days Borrowed</th>
            </tr>
          </thead>
          <tbody>
            {activeBorrowings.map((b) => {
              const checkoutDate = new Date(b.createdAt);
              const days = calculateDays(checkoutDate, new Date());
              return (
                <tr key={b._id}>
                  <td>{b.userId?.name}</td>
                  <td>{b.bookId?.name}</td>
                  <td>{checkoutDate.toLocaleDateString()}</td>
                  <td>{days}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Book</h3>
            {["name", "author", "genre", "language", "totalCopies"].map(field => (
              <input
                key={field}
                type={field === "totalCopies" ? "number" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={bookForm[field]}
                onChange={(e) => setBookForm({ ...bookForm, [field]: e.target.value })}
              />
            ))}
            <button onClick={handleAddBook}>Add</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;
