import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Books.css";
import "../styles/global.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    genre: "",
    language: "",
    totalCopies: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [books, searchTerm]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
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

  const handleEdit = (book) => {
    setNewBook({
      name: book.name,
      author: book.author,
      genre: book.genre,
      language: book.language,
      totalCopies: book.totalCopies
    });
    setEditingBookId(book._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    const { name, author, genre, language, totalCopies } = newBook;
    if (!name || !author || !genre || !language || !totalCopies) {
      return alert("Please fill all fields");
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/books/edit/${editingBookId}`, newBook);
      } else {
        await axios.post("http://localhost:5000/api/books/add", newBook);
      }
      fetchBooks();
      closeModal();
    } catch (err) {
      alert("Error saving book.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingBookId(null);
    setNewBook({ name: "", author: "", genre: "", language: "", totalCopies: "" });
  };

  const handleSearch = (term) => {
    const lower = term.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.name.toLowerCase().includes(lower) ||
        book.author.toLowerCase().includes(lower)
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="books-container">
      <button className="float-add-btn" onClick={() => setShowModal(true)}>Add Book</button>
      <h2>Books</h2>

      <input
        type="text"
        placeholder="Search by name or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", maxWidth: "400px" }}
      />

      <div className="table-wrapper">
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
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.bookId}</td>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.language}</td>
                  <td>{book.totalCopies}</td>
                  <td>{book.totalCopies > 0 ? "Available" : "Not Available"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteBook(book._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Book" : "Add New Book"}</h3>
            {["name", "author", "genre", "language", "totalCopies"].map((field) => (
              <input
                key={field}
                type={field === "totalCopies" ? "number" : "text"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={newBook[field]}
                onChange={(e) => setNewBook({ ...newBook, [field]: e.target.value })}
              />
            ))}
            <button onClick={handleSave}>{isEditing ? "Update" : "Add"}</button>
            <button className="close-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
