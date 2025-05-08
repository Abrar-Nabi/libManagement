import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PendingFines.css";

const rentPerDay = 10;

const PendingFines = () => {
  const [pendingFines, setPendingFines] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/checkout");
        const checkouts = res.data;

        const pending = {};

        checkouts.forEach((c) => {
          if (!c.returned) {
            const userId = c.userId?._id;
            const name = c.userId?.name;
            const userIdLabel = c.userId?.userId;
            const days = Math.floor((new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24));
            const fine = days > 9 ? (days - 9) * rentPerDay : 0;

            if (!pending[userId]) {
              pending[userId] = {
                name,
                userIdLabel,
                totalFine: 0,
                bookCount: 0,
                totalDays: 0, // Store the total days borrowed
              };
            }

            pending[userId].totalFine += fine;
            pending[userId].bookCount += 1;
            pending[userId].totalDays += days; // Add days to the total borrowed days
          }
        });

        setPendingFines(Object.values(pending));
      } catch (error) {
        console.error("Failed to fetch checkouts:", error);
      }
    };

    fetchCheckouts();
  }, []);

  // Filter the pending fines based on the search query
  const filteredFines = pendingFines.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.userIdLabel.toLowerCase().includes(query) ||
      user.totalDays.toString().includes(query) // Filter by the total days borrowed
    );
  });

  return (
    <div className="pending-fines-container">
      <h2>Pending Fines</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, user ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {filteredFines.length === 0 ? (
        <p>No user found</p> // Show this message if no matching users are found
      ) : (
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>User ID</th>
              <th>Books Not Returned</th>
              <th>Pending Fine (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((user) => (
              <tr key={user.userIdLabel}>
                <td>{user.name}</td>
                <td>{user.userIdLabel}</td>
                <td>{user.bookCount}</td>
                <td>₹{user.totalFine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingFines;
