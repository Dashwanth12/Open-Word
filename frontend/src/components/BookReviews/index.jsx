import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import BASE_URL from '../../utils/api'
import './index.css'

function StarRating({ value, onChange, readOnly = false }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="stars">
            {[1, 2, 3, 4,      5].map(star => (
                <span
                    key={star}
                    className={`star ${star <= (hovered || value) ? 'filled' : ''} ${readOnly ? 'readonly' : ''}`}
                    onClick={() => !readOnly && onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

function BookReviews({ bookId }) {
    const { getToken, isSignedIn } = useAuth()
    const { user } = useUser()

    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [alreadyReviewed, setAlreadyReviewed] = useState(false)

    useEffect(() => { fetchReviews() }, [bookId])

    useEffect(() => {
        if (user && reviews.length > 0) {
            setAlreadyReviewed(reviews.some(r => r.userId === user.id))
        }
    }, [reviews, user])

    async function fetchReviews() {
        const res = await fetch(`${BASE_URL}/api/books/${bookId}/reviews`)
        const data = await res.json()
        setReviews(data.reviews || [])
        setReviewsLoading(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (rating === 0) { setError('Please select a star rating.'); return }
        setError('')
        setSubmitting(true)

        const token = await getToken()
        const res = await fetch(`${BASE_URL}/api/books/${bookId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                rating,
                comment,
                userName: user.fullName || user.username || 'Anonymous'
            })
        })

        const data = await res.json()
        if (!res.ok) {
            setError(data.message || 'Failed to submit review.')
            setSubmitting(false)
            return
        }

        setReviews(prev => [data.review, ...prev])
        setAlreadyReviewed(true)
        setRating(0)
        setComment('')
        setSubmitting(false)
    }

    async function handleDelete(reviewId) {
        if (!confirm('Delete your review?')) return
        const token = await getToken()
        await fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        setReviews(prev => prev.filter(r => r._id !== reviewId))
        setAlreadyReviewed(false)
    }

    if (reviewsLoading) return <p className="reviews-loading">Loading reviews...</p>

    return (
        <div className="reviews-section">
            <h2 className="reviews-title">
                Reviews <span className="reviews-count">({reviews.length})</span>
            </h2>

            {isSignedIn && !alreadyReviewed && (
                <form className="review-form" onSubmit={handleSubmit}>
                    <p className="review-form-label">Leave a review</p>
                    <StarRating value={rating} onChange={setRating} />
                    <textarea
                        className="review-textarea"
                        placeholder="Share your thoughts... (optional)"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={3}
                    />
                    {error && <p className="review-error">{error}</p>}
                    <button type="submit" className="review-submit-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {isSignedIn && alreadyReviewed && (
                <p className="review-already">You've already reviewed this book.</p>
            )}

            {!isSignedIn && (
                <p className="review-signin-prompt"> Please Sign in to leave a review.</p>
            )}

            {reviews.length === 0 ? (
                <p className="reviews-empty">No reviews yet. Be the first!</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map(r => (
                        <div key={r._id} className="review-card">
                            <div className="review-header">
                                <span className="review-author">{r.userName}</span>
                                <StarRating value={r.rating} readOnly />
                                <span className="review-date">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                                {user?.id === r.userId && (
                                    <button
                                        className="review-delete-btn"
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            {r.comment && <p className="review-comment">{r.comment}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BookReviews
export { StarRating }