// pages/AllBooks.js
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Footer from "./Footer";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
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
        <h2>Browse All Books</h2>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="book-list">
          {filteredBooks.map((book) => (
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
      <Footer/>
    </>
  );
};

export default AllBooks;
