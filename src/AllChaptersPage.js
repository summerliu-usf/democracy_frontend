import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AllChaptersPage = () => {
    const { bookId } = useParams(); // Extract the bookId from the route
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch chapters for the given bookId
        axios
            .get(`/books/${bookId}/chapters`) // fix axios call
            .then((response) => {
                setChapters(response.data); // Set chapters as a list of Chapter objects
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching chapters:", error);
                setLoading(false);
            });
    }, [bookId]);

    if (loading) {
        return <p>Loading chapters...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chapters for Book {bookId}</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {chapters.map((chapter) => (
                    <li key={chapter.id} style={{ marginBottom: "20px" }}>
                        <h3>{chapter.title}</h3>
                        {chapter.podcastUrl && (
                            <p>
                                <a href={chapter.podcastUrl} target="_blank" rel="noopener noreferrer">
                                    Listen to Podcast
                                </a>
                            </p>
                        )}
                        <p>Book ID: {chapter.bookId}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllChaptersPage;
