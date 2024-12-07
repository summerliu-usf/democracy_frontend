import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ChapterPage.css";

function ChapterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { bookId, chapterId } = useParams();
    console.log({ bookId, chapterId });
    const [chapterDetails, setChapterDetails] = useState(null);
    const [bookTitle, setBookTitle] = useState("");
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [answer, setAnswer] = useState("");

    function getBookTitle() {
        console.log("Determining book title...");
        if (bookId === "TOTM") {
            setBookTitle("Tyranny of the Minority");
        } else {
            setBookTitle("How Democracies Die");
        }
        console.log("Book title set to:", bookId === "TOTM" ? "Tyranny of the Minority" : "How Democracies Die");
    }

    function fetchChapterDetails() {
        console.log("Fetching chapter details...");
        setLoading(true);
        axios
            .get(`https://democracybackend.wl.r.appspot.com/${bookId}/chapters/${chapterId}`)
            .then((response) => {
                console.log("Chapter details fetched successfully:", response.data);
                setChapterDetails(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching chapter details:", error);
                setError(error.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        console.log("useEffect triggered with bookId:", bookId, "and chapterId:", chapterId);
        fetchChapterDetails();
        getBookTitle();
    }, [bookId, chapterId]);

    const handleSendMessage = () => {
        console.log("Sending message to OpenAI...");
        setError(null);
        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the book ${bookTitle}.` },
                        { role: "user", content: message },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                console.log("OpenAI response received:", res.data);
                setResponse(res.data.choices[0]?.message?.content || "No response content received.");
            })
            .catch((error) => {
                console.error("Error sending message to OpenAI:", error.response || error.message);
                setError("Failed to get a response from OpenAI. Check logs for details.");
            });
    };

    const handleGenerateQuestion = () => {
        console.log("Generating question and answer with OpenAI...");
        setError(null);
        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the book ${bookTitle}.` },
                        { role: "user", content: `Generate a thought-provoking question about chapter ${chapterId} in the book ${bookTitle}.` },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                console.log("Generated question:", res.data);
                setQuestion(res.data.choices[0]?.message?.content || "No question generated.");
                return axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the book ${bookTitle}.` },
                            { role: "user", content: `Provide the answer to the following question based on book content: ${res.data.choices[0].message.content}` },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            })
            .then((answerRes) => {
                console.log("Generated answer:", answerRes.data);
                setAnswer(answerRes.data.choices[0]?.message?.content || "No answer generated.");
            })
            .catch((error) => {
                console.error("Error generating question/answer with OpenAI:", error.response || error.message);
                setError("Failed to generate question or answer. Check logs for details.");
            });
    };

    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    if (!chapterDetails) {
        console.log("No chapter details available yet.");
        return <p>Loading chapter details...</p>;
    }

    return (
        <div style={{ margin: "0", padding: "0" }}>
            <div>
                <nav className="navbar">
                    <h2>The Democracy Library</h2>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="center-div">
                <h1>{chapterDetails.title}</h1>
                <hr />
                <h2>Notebook LM Generated Podcast</h2>
                <p>Listen to a podcast on this chapter generated by Notebook LM's AIs!</p>
                <p>(Links to external website)</p>
                {chapterDetails.podcastUrl ? (
                    <div
                        style={{
                            border: "1px solid #ccc",
                            padding: "16px",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <a
                            href={chapterDetails.podcastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "#007BFF", fontWeight: "bold" }}
                        >
                            Listen to the Podcast
                        </a>
                    </div>
                ) : (
                    <p>Loading podcast URL...</p>
                )}
                <hr />
                <h2>Chat about this chapter</h2>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question about this chapter..."
                    rows={4}
                    cols={50}
                    style={{
                        resize: "none",
                        overflowY: "auto",
                        width: "100%",
                        minHeight: "100px",
                        maxHeight: "300px",
                    }}
                />
                <button onClick={handleSendMessage}>Send</button>
                <hr />
                <div style={{ maxWidth: "100%", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                    <h3>AI Response:</h3>
                    <p>{response}</p>
                </div>

                <h2>Generate a Question</h2>
                <button onClick={handleGenerateQuestion} style={{ margin: "20px" }}>
                    Generate Question
                </button>
                {question && (
                    <div style={{ marginTop: "20px" }}>
                        <p style={{ whiteSpace: "pre-wrap" }}>
                            <strong>Question:</strong> {question}
                        </p>
                        <button onClick={toggleShowAnswer}>
                            {showAnswer ? "Hide Answer" : "Show Answer"}
                        </button>
                        {showAnswer && (
                            <p style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
                                <strong>Answer:</strong> {answer}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChapterPage;
