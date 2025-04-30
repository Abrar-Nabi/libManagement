import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import NewArrivals from "./NewArrivals";
import AllBooks from "./AllBooks";

import "../styles/UserDashboard.css";
import Footer from "./Footer";

const quotes = [
  "Reading is essential for those who seek to rise above the ordinary. – Jim Rohn",
  "A reader lives a thousand lives before he dies. – George R.R. Martin",
  "Books are a uniquely portable magic. – Stephen King",
];

const UserDashboard = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchAllBooks();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/checkout/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowings(res.data.current || []);
    } catch (error) {
      console.error("Failed to fetch user borrowings:", error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const calculateDays = (start) => {
    const diff = new Date() - new Date(start);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Navbar />
      <div className="user-dashboard">
        <div className="welcome-box">
          <h2>Welcome back 👋</h2>
          <p className="quote">“{quote}”</p>
        </div>

        <h3>Currently Borrowed Books</h3>
        {borrowings.length === 0 ? (
          <p>You haven’t borrowed any books yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Checkout Date</th>
                <th>Days Borrowed</th>
                <th>Rent (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => {
                const days = calculateDays(b.createdAt);
                return (
                  <tr key={b._id}>
                    <td>{b.bookId?.name}</td>
                    <td>{b.bookId?.author}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>{days}</td>
                   <td>₹{Math.max(0, days - 9) * 10}</td>

                    <td>{b.returned ? "✅ Returned" : " Not Returned"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        
      </div>
      <Footer/>
    </>
  );
};

export default UserDashboard;
