import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchCheckouts();
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/checkout");
      setCheckouts(res.data);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/members");
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedBook || !selectedMember || !dueDate) return alert("All fields are required");

    try {
      await axios.post("http://localhost:5000/api/checkout/checkout", {
        memberId: selectedMember,
        bookId: selectedBook,
        dueDate,
      });
      fetchCheckouts();
    } catch (error) {
      console.error("Error checking out book:", error);
    }
  };

  const handleReturn = async (checkoutId) => {
    try {
      await axios.put(`http://localhost:5000/api/checkout/return/${checkoutId}`);
      fetchCheckouts();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <div className="checkout-container">
      <h2>📚 Book Checkout</h2>

      <div className="checkout-form">
        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
          <option value="">Select Member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>{member.name}</option>
          ))}
        </select>

        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>{book.name}</option>
          ))}
        </select>

        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={handleCheckout}>🔄 Checkout</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Checkout Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map((checkout) => (
            <tr key={checkout._id}>
              <td>{checkout.memberId.name}</td>
              <td>{checkout.bookId.name}</td>
              <td>{new Date(checkout.checkoutDate).toLocaleDateString()}</td>
              <td>{new Date(checkout.dueDate).toLocaleDateString()}</td>
              <td>{checkout.returned ? "✅ Returned" : "❌ Borrowed"}</td>
              <td>
                {!checkout.returned && (
                  <button className="return-btn" onClick={() => handleReturn(checkout._id)}>↩ Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Checkout;
