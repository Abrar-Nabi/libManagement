import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Checkout.css";

const Checkout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");


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

  const token = localStorage.getItem("token");
  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedBook || !selectedMember) {
      return alert("Please select a book and a member.");
    }
  
    // Count how many books this user currently has not returned
    const activeCheckouts = checkouts.filter(
      (c) => c.userId?._id === selectedMember && !c.returned
    );
  
    if (activeCheckouts.length >= 3) {
      return alert("❌ This member already has 3 books checked out.");
    }
  
    try {
      const book = books.find(b => b._id === selectedBook);
      if (book.totalCopies <= 0) {
        return alert(`❌ Book "${book.name}" is not available for checkout.`);
      }
  
      await axios.post("http://localhost:5000/api/checkout/checkout", {
        memberId: selectedMember,
        bookId: selectedBook,
      });
  
      fetchCheckouts();
      setBookSearch("");
      setMemberSearch("");
      setSelectedBook("");
      setSelectedMember("");
    } catch (error) {
      console.error("Error checking out book:", error);
    }
  };
  
  
  const handleReturn = async (checkoutId) => {
    try {
      await axios.put(`http://localhost:5000/api/checkout/return/${checkoutId}`);
      setCheckouts(prev => prev.filter(c => c._id !== checkoutId));
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };
  
  const calculateDaysBorrowed = (start) => {
    const diff = new Date() - new Date(start);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const rentPerDay = 10;

  const filteredBooks = books.filter(
    (b) =>
      b.name.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.bookId?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.userId?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="checkout-container">
      <h2>Book Checkout</h2>

      <div className="checkout-form">
        <div>
          <input
            type="text"
            placeholder="Search Member"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
          />
          {memberSearch && (
            <ul className="dropdown">
              {filteredMembers.map((m) => (
                <li
                  key={m._id}
                  onClick={() => {
                    setSelectedMember(m._id);
                    setMemberSearch(m.name + " (" + m.userId + ")");
                  }}
                >
                  {m.name} ({m.userId})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Search Book "
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
          />
          {bookSearch && (
            <ul className="dropdown">
              {filteredBooks.map((b) => (
                <li
                  key={b._id}
                  onClick={() => {
                    setSelectedBook(b._id);
                    setBookSearch(b.name + " (" + b.bookId + ")");
                  }}
                >
                  {b.name} ({b.bookId})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleCheckout}>Checkout</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Checkout Date</th>
            <th>Days Borrowed</th>
            <th>Total Rent (₹)</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map((checkout) => {
            const checkoutDate = new Date(checkout.createdAt);
            const days = calculateDaysBorrowed(checkoutDate);
            const rent = days > 9 ? (days - 9) * rentPerDay : 0;

            return (
              <tr key={checkout._id}>
                <td>{checkout.userId?.name}</td>
                <td>{checkout.bookId?.name}</td>
                <td>{checkoutDate.toLocaleDateString()}</td>
                <td>{days}</td>
                <td>₹{rent}</td>
                <td>
                  {!checkout.returned && (
                    <button className="return-btn" onClick={() => handleReturn(checkout._id)}>
                      ↩ Return
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Checkout;
