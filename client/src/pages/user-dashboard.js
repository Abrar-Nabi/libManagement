import React, { useEffect, useState } from "react";
import "../styles/UserDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const quotes = [
  "Reading is a discount ticket to everywhere. – Mary Schmich",
  "A room without books is like a body without a soul. – Cicero",
  "Books are a uniquely portable magic. – Stephen King",
  "The more that you read, the more things you will know. – Dr. Seuss",
  "Reading gives us someplace to go when we have to stay where we are. – Mason Cooley",
  "Once you learn to read, you will be forever free. – Frederick Douglass",
];

const HomePage = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="overlay">
          <div className="hero-content">
            <h1>Welcome to Your Library</h1>
            <p className="quote-text">“{quotes[quoteIndex]}”</p>
            <div className="hero-buttons">
              {/* Add buttons if needed */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
