import React from "react";


const Book = ({ coverImage, title, description, onViewChapters }) => {
    return (
        <div className="book">
            <img src={coverImage} alt={`${title} cover`} className="book-cover" />
            <h3>{title}</h3>
            <p>{description}</p>
            <button onClick={onViewChapters}>View All Chapters</button>
        </div>
    );
};

export default Book;
