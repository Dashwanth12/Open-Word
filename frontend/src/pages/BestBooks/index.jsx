import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../../components/BookCard";
import BASE_URL from '../../utils/api'
import "./index.css";

function BestBooks() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [bestSellerBooks, setBestSellerBooks] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBestBooks = async () => {
            setLoading(true);
            setError(false);

            try {
                
                const res = await fetch(`${BASE_URL}/api/books?bestSeller=true`);

                if (res.ok) {
                    const data = await res.json();

                    // Supports different response structures
                    setBestSellerBooks(
                        data.bestSellers || data.books || data || []
                    );
                } else {
                    setError(true);
                }
            } catch (err) {
                console.log("Failed to fetch best seller books!", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBestBooks();
    }, []);

    if (loading) {
        return (
            <div className="bst-loader">
                <p>Please wait...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bst-error">
                <p>Something went wrong. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="bst-book-page">
            {/* Back Button - Top Left */}
            <div className="bst-top-bar">
                <button
                    className="det-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {/* Header */}
            <div className="bst-book-header">
                <p className="bst-book-tag">
                    Check out our best selling books
                </p>

                <h1 className="bst-book-title">
                    Best Sellers
                </h1>
            </div>

            {/* Books */}
            {bestSellerBooks.length === 0 ? (
                <div className="bst-empty">
                    <p>
                        No best seller books found right now.
                        Stay tuned!
                    </p>
                </div>
            ) : (
                <div className="books-grid">
                    {bestSellerBooks.map((each) => (
                        <BookCard
                            key={each._id}
                            book={each}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default BestBooks;