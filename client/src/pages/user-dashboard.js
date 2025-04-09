import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";
import Navbar from "../components/Navbar";

const quotes = [
  "Reading is essential for those who seek to rise above the ordinary. – Jim Rohn",
  "A reader lives a thousand lives before he dies. – George R.R. Martin",
  "Books are a uniquely portable magic. – Stephen King",
];

const UserDashboard = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [userName, setUserName] = useState("");
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
      setUserName(res.data.current?.[0]?.userId?.name || "User");
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
      <th>Status</th> {/* ✅ new */}
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
          <td>₹{days * 10}</td>
          <td>{b.returned ? "✅ Returned" : " Not Returned"}</td> {/* ✅ new */}
        </tr>
      );
    })}
  </tbody>
</table>

        )}

        <h3>🆕 New Arrivals</h3>
        <div className="new-arrivals">
          {books.slice(-5).reverse().map((book) => (
            <div key={book._id} className="book-card">
              <h4>{book.name}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p className={book.totalCopies > book.borrowedCopies ? "available" : "unavailable"}>
                {book.totalCopies > book.borrowedCopies ? "Available" : "Not Available"}
              </p>
            </div>
          ))}
        </div>

        <h3>📚 Browse All Books</h3>
        <div className="all-books">
          {books.map((book) => (
            <div key={book._id} className="book-card small">
              <h5>{book.name}</h5>
              <p>{book.author}</p>
              <p className={book.totalCopies > book.borrowedCopies ? "available" : "unavailable"}>
                {book.totalCopies > book.borrowedCopies ? "Available" : "Not Available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
