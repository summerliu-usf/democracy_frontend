import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChapterPage() {
    const { bookId, chapterId } = useParams(); // Get bookId and chapterId from the URL
    const [chapterDetails, setChapterDetails] = useState(null);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    // Fetch chapter details when the component loads
    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const res = await axios.get(`/${bookId}/chapters/${chapterId}`);
                setChapterDetails(res.data); // Axios automatically parses JSON
            } catch (error) {
                console.error("Error fetching chapter details:", error);
            }
        };
        fetchChapter();
    }, [bookId, chapterId]);

    // Handle sending a message to the backend
    const handleSendMessage = async () => {
        try {
            const res = await axios.post(
                `/api/books/${bookId}/chapters/${chapterId}/chat/send`,
                null, // No request body needed for this POST request
                {
                    params: { message: message }, // Query parameters
                    headers: { "Content-Type": "application/json" },
                }
            );
            setResponse(res.data); // Update the response in the UI
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!chapterDetails) {
        return <p>Loading chapter details...</p>;
    }

    return (
        <div>
            <h1>{chapterDetails.title}</h1>
            <p>Listen to the podcast here: {chapterDetails.podcastUrl}</p>

            <div>
                <h2>Chat about this chapter</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question about this chapter..."
                    rows={4}
                    cols={50}
                />
                <br />
                <button onClick={handleSendMessage}>Send</button>
            </div>

            <div>
                <h3>AI Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default ChapterPage;
