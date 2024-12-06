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


    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [answer, setAnswer] = useState("");


    function fetchChapterDetails() {
        setLoading(true);
        axios
            .get(`https://democracybackend.wl.r.appspot.com/${bookId}/chapters/${chapterId}`)
            .then((response) => {
                setChapterDetails(response.data);
                console.log(chapterDetails);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching chapter details:", error);
                setError(error.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchChapterDetails();
    }, [bookId, chapterId]);


    // const handleSendMessage = async () => {
    //     try {
    //         const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    //             model: "gpt-4",
    //             messages: [
    //                 { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
    //                 { role: "user", content: message },
    //             ],
    //             assistant_id: 'asst_JOt4R77V9iQdKseN5qnAj70G',
    //         }, {
    //             headers: { Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    //                 "Content-Type": "application/json"},
    //         });
    //
    //         setResponse(res.data.choices[0].message.content);
    //     } catch (error) {
    //         console.error("Error sending message to OpenAI:", error);
    //     }
    // };
    const handleSendMessage = () => {
        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
                        { role: "user", content: message },
                    ],
                    assistant_id: 'asst_JOt4R77V9iQdKseN5qnAj70G',
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                setResponse(res.data.choices[0].message.content);
            })
            .catch((error) => {
                console.error("Error sending message to OpenAI:", error);
            });
    };

    //
    // const handleGenerateQuestion = async () => {
    //     try {
    //         const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    //             model: "gpt-4",
    //             messages: [
    //                 { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
    //                 { role: "user", content: `Generate a thought-provoking question about chapter ${chapterId} in the book.` },
    //             ],
    //             assistant_id: chapterDetails.assistantId,
    //         }, {
    //             headers: { Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` },
    //         });
    //
    //         setQuestion(res.data.choices[0].message.content);
    //
    //         const answerRes = await axios.post("https://api.openai.com/v1/chat/completions", {
    //             model: "gpt-4",
    //             messages: [
    //                 { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
    //                 { role: "user", content: `Provide the answer to the following question: ${res.data.choices[0].message.content}` },
    //             ],
    //             assistant_id: chapterDetails.assistantId,
    //         }, {
    //             headers: { Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` },
    //         });
    //
    //         setAnswer(answerRes.data.choices[0].message.content);
    //     } catch (error) {
    //         console.error("Error generating question/answer with OpenAI:", error);
    //     }
    // };
    const handleGenerateQuestion = () => {
        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
                        { role: "user", content: `Generate a thought-provoking question about chapter ${chapterId} in the book.` },
                    ],
                    assistant_id: chapterDetails.assistantId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                setQuestion(res.data.choices[0].message.content);
                return axios.post(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        model: "gpt-4",
                        messages: [
                            { role: "system", content: `You are an assistant analyzing chapter ${chapterId} of the provided book.` },
                            { role: "user", content: `Provide the answer to the following question: ${res.data.choices[0].message.content}` },
                        ],
                        assistant_id: chapterDetails.assistantId,
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
                setAnswer(answerRes.data.choices[0].message.content);
            })
            .catch((error) => {
                console.error("Error generating question/answer with OpenAI:", error);
            });
    };


    const toggleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    if (!chapterDetails) {
        return <p>Loading chapter details...</p>;
    }

    return (
        <div style={{margin: "0", padding: "0"}}>
            <div>
            <nav className="navbar">
                <h2>The Democracy Library</h2>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav></div>
            <div className="center-div">
                <h1>{chapterDetails.title}</h1>
                <hr></hr>
                <h2>Notebook LM Generated Podcast</h2>
                <p>Listen to a podcast on this chapter generated by Notebook LM's AIs!</p>
                <p>(Links to external website)</p>
                {chapterDetails.podcastUrl ? (
                    <div style={{
                        border: "1px solid #ccc",
                        padding: "16px",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9"
                    }}>
                        <a href={chapterDetails.podcastUrl} target="_blank" rel="noopener noreferrer"
                           style={{ textDecoration: "none", color: "#007BFF", fontWeight: "bold" }}>
                            Listen to the Podcast
                        </a>
                    </div>
                ) : (
                    <p>Loading podcast URL...</p>
                )}
                <hr></hr>
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
                <button onClick={handleGenerateQuestion} style={{ margin: "20px"}}>Generate Question</button>
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
