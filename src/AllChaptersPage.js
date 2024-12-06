import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

const AllChaptersPage = () => {
    const { bookId } = useParams(); // Get bookId from the URL
    const [chapters, setChapters] = useState([]);

    // Set chapters only once based on bookId
    useEffect(() => {
        if (bookId === "TOTM") {
            setChapters([
                { id: "1", title: "Fear of Losing" },
                { id: "2", title: "The Banality of Authoritarianism" },
                { id: "3", title: "It Has Happened Here" },
                { id: "4", title: "Why the Republican Party Abandoned Democracy" },
                { id: "5", title: "Fettered Majorities" },
                { id: "6", title: "Minority Rule" },
                { id: "7", title: "America the Outlier" },
                { id: "8", title: "Democratizing Our Democracy" },
            ]);
        } else if (bookId === "HDD") {
            setChapters([
                { id: "1", title: "Fateful Alliances" },
                { id: "2", title: "Gatekeeping in America" },
                { id: "3", title: "The Great Republican Abdication" },
                { id: "4", title: "Subverting Democracy" },
                { id: "5", title: "The Guardrails of Democracy" },
                { id: "6", title: "The Unwritten Rules of American Politics" },
                { id: "7", title: "The Unraveling" },
                { id: "8", title: "Trump Against the Guardrails" },
                { id: "9", title: "Saving Democracy" },
            ]);
        } else {
            setChapters([]);
        }
    }, [bookId]);

    return (
        <div style={{ padding: "20px", margin: "2vh"}}>
            <h1>
                {bookId === "TOTM"
                    ? "Tyranny of the Minority"
                    : "How Democracies Die"}
            </h1>
            <ul style={{ listStyleType: "none", padding: 0, color: "black" }}>
                {chapters.map((chapter) => (
                    <li
                        key={chapter.id}
                        style={{
                            marginBottom: "10px",
                            fontSize: "1.2rem",
                            color: "black",
                        }}
                    >
                        <Link
                            to={`${chapter.id}`}
                            style={{
                                textDecoration: "none",
                                color: "black",
                            }}
                        >
                            Chapter {chapter.id}: {chapter.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllChaptersPage;
