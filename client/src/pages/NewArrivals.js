// pages/NewArrivals.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Footer from "./Footer";

const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data.slice(-4).reverse()))
      .catch((err) => console.error(err));
  }, []);

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>Recently Added Books</h2>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ margin: "10px 0", padding: "8px", width: "100%", maxWidth: "400px" }}
        />
        <div className="book-list">
          {filteredBooks.length === 0 ? (
            <p className="no-results">No results found.</p>
          ) : (
            filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <h4>{book.name}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p className={book.totalCopies > book.borrowedCopies ? "available" : "unavailable"}>
                  {book.totalCopies > book.borrowedCopies ? "Available" : "Not Available"}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
      <Footer />
    </>
  );
};

export default NewArrivals;
