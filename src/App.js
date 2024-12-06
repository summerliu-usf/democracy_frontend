import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Book from "./Book";
import AllChaptersPage from "./AllChaptersPage";
import ChapterPage from "./ChapterPage";

const App = () => {
    // const [books, setBooks] = useState([]);
    //
    // useEffect(() => {
    //     axios
    //         .get("/books")
    //         .then((response) => {
    //             setBooks(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching books:", error);
    //         });
    // }, []);
    const hardcodedBooks = [
        {
            id: "HDD",
            coverImage: "https://m.media-amazon.com/images/I/71++nkYi9OL._AC_UF1000,1000_QL80_.jpg",
            title: "How Democracies Dies",
            description: "How Democracies Die is a 2018 comparative politics book by the Harvard University political scientists Steven Levitsky and Daniel Ziblatt about democratic backsliding and how elected leaders can gradually subvert the democratic process to increase their power. ",
        },
        {
            id: "TOTM",
            coverImage: "https://m.media-amazon.com/images/I/81rb-tnCkdL.jpg",
            title: "Tyranny of the Minority",
            description: "With the clarity and brilliance that made their first book, How Democracies Die, a global bestseller, Harvard professors Steven Levitsky and Daniel Ziblatt offer a coherent framework for understanding these volatile times. They draw on a wealth of examples—from 1930s France to present-day Thailand—to explain why and how political parties turn against democracy. They then show how our Constitution makes us uniquely vulnerable to attacks from within. ",
        },
    ];

    // Use hardcodedBooks as the initial state
    const [books, setBooks] = useState(hardcodedBooks);
    const navigate = useNavigate();
    const [input, setInput] = useState("");

    // Navigate to chapters page for a specific book
    const handleViewChapters = (bookId) => {
        navigate(`/${bookId}/chapters`);
    };
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
     const handleChatSubmit = async () => {
        if (message.trim() === "") return; // Prevent empty submissions

        try {
            // Example POST request logic (adjust endpoint as needed)
            const res = await fetch("", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setResponse(data.reply || "No response received");
        } catch (error) {
            console.error("Error communicating with AI:", error);
            setResponse("Error communicating with AI");
        }
    };

    return (
        <div className="app-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2>The Democracy Library</h2>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {books.map((book) => (
                        <li key={book.id}>
                            <Link to={`/${book.id}/chapters`}>{book.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                <h1>The Democracy Library</h1>
                <div className="books-container">
                    {books.map((book) => (
                        <div className="book-card" key={book.id}>
                            <img src={book.coverImage} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p>{book.description}</p>
                            <button onClick={() => handleViewChapters(book.id)}>
                                View Chapters
                            </button>
                        </div>
                    ))}
                </div>

                {/* Chat Section */}
                <div className="chat-section">
                    <h2>Chat about the Books</h2>
                    <textarea value={response} readOnly style={{background: "transparent"}} />
                    <input
                        type="text"
                        placeholder="Ask a question about the books to ChatGPT..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                            height: "auto",
                        }}/>
                    <button onClick={handleChatSubmit}>Submit</button>
                </div>
            </div>

            {/*    /!* Footer *!/*/}
        {/*    <footer className="footer">*/}
        {/*        <p>Created by Summer Liu</p>*/}
        {/*    </footer>*/}
        </div>
    );
};

const MainApp = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:bookId/chapters" element={<AllChaptersPage />} />
            <Route path="/:bookId/chapters/:chapterId" element={<ChapterPage />} />
        </Routes>
    </Router>
);

export default MainApp;
