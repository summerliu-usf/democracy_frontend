import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Book from "./Book";
import AllChaptersPage from "./AllChaptersPage";

const App = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch all books from the backend
  useEffect(() => {
    axios
        .get("/books") // fix axios call
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
        });
  }, []);

  // Navigate to chapters page for a specific book
  const handleViewChapters = (bookId) => {
    navigate(`/chapters/${bookId}`);
  };

  return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          {books.map((book) => (
              <Book
                  key={book.id}
                  coverImage={book.coverImage}
                  title={book.title}
                  description={book.description}
                  onViewChapters={() => handleViewChapters(book.id)}
              />
          ))}
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2>Chat Window</h2>
          <textarea
              placeholder="Type your message here..."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                boxSizing: "border-box",
              }}
          />
        </div>
      </div>
  );
};

const MainApp = () => (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:bookId/chapters" element={<AllChaptersPage />} />
          <Route path="/chapters/:chapterId/" element={<ChapterPage />} />
      </Routes>
    </Router>
);

export default MainApp;
