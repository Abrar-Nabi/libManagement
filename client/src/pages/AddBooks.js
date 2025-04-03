import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async () => {
    if (!name || !author || !genre || !language || !totalCopies) {
      return alert("Please fill all fields");
    }
    try {
      await axios.post("http://localhost:5000/api/books/add", { name, author, genre, language, totalCopies });
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/delete/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const openEditModal = (book) => {
    setEditId(book._id);
    setName(book.name);
    setAuthor(book.author);
    setGenre(book.genre);
    setLanguage(book.language);
    setTotalCopies(book.totalCopies);
    setShowModal(true);
  };

  const editBook = async () => {
    if (!name || !author || !genre || !language || !totalCopies) {
      return alert("Please fill all fields");
    }
    try {
      await axios.put(`http://localhost:5000/api/books/edit/${editId}`, { name, author, genre, language, totalCopies });
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setAuthor("");
    setGenre("");
    setLanguage("");
    setTotalCopies("");
    setShowModal(false);
  };

  return (
    <div className="books-container">
      <h2>📚 Books</h2>
      <div className="add-book-form">
        <input type="text" placeholder="Book Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <input type="text" placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <input type="number" placeholder="Total Copies" value={totalCopies} onChange={(e) => setTotalCopies(e.target.value)} />
        <button onClick={addBook}>➕ Add Book</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Language</th>
            <th>Total Copies</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.bookId}</td>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.language}</td>
              <td>{book.totalCopies}</td>
              <td>{book.totalCopies > 0 ? "Available" : "Not Available"}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(book)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => deleteBook(book._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
