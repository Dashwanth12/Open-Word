import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useAuth } from '@clerk/clerk-react'
import { useCart } from '../../context/CartContext'
import { useClerk } from '@clerk/clerk-react'
import BASE_URL from '../../utils/api'
import BookReviews, { StarRating } from '../../components/BookReviews'
import './index.css'

function DetailsPage() {
    const [loading, setLoading] = useState(false)
    const [bookDetails, setBooksDetails] = useState(null)
    const [error, setError] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const [expanded, setExpanded] = useState(false)
    const [similarBooks, setSimilarBooks] = useState([])
    const [isAdded, setIsAdded] = useState(false)
    const { addToCart } = useCart()
    const { isSignedIn } = useAuth()
    const { openSignIn } = useClerk()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${BASE_URL}/api/books/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setBooksDetails(data.book)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.log('Failed to Fetch Book Details!', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchBookDetails()
    }, [id])

    useEffect(() => {
        if (!bookDetails?.genre) return
        const fetchSimilar = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/books?genre=${bookDetails.genre}`)
                if (res.ok) {
                    const data = await res.json()
                    setSimilarBooks((data.books || []).filter(b => b._id !== id).slice(8, 5))
                }
            } catch (err) {
                console.log('similar books error:', err)
            }
        }
        fetchSimilar()
    }, [bookDetails?.genre])

    const handleAddToCart = async () => {
        if (!isSignedIn) { openSignIn(); return }
        await addToCart(bookDetails._id)
        setBooksDetails(prev => ({ ...prev, stock: prev.stock - 1 }))
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    if (loading) {
        return (
            <div className='books-loader'>
                <Loader />
                <p className='books-loader-p'>Please wait...</p>
            </div>
        )
    }

    if (error) return <div className="det-state"><p>Failed to load book.</p></div>
    if (!bookDetails) return null

    const tabs = ['description', 'details', 'reviews']
    const description = bookDetails.description || 'No description available.'
    const isLongDescription = description.length > 400

    return (
        <div className="det-page">
            <div className="det-inner">

                <button className="det-back" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="det-grid">

                    {/* Col 1 — Cover */}
                    <div className="det-cover-col">
                        <img
                            src={bookDetails.image}
                            alt={bookDetails.title}
                            className="det-cover"
                        />
                    </div>

                    {/* Col 2 — Info */}
                    <div className="det-info-col">
                        {bookDetails.bestSeller && (
                            <span className="det-badge">#1 Best Seller</span>
                        )}

                        <h1 className="det-title">{bookDetails.title}</h1>
                        <p className="det-author">By {bookDetails.author}</p>

                        <div className="det-meta-row">
                            <span className="det-genre">{bookDetails.genre}</span>
                            {bookDetails.stock > 0
                                ? <span className="det-instock">{bookDetails.stock} in stock</span>
                                : <span className="det-outstock">Out of stock</span>
                            }
                        </div>

                        <div className="det-rating-row">
                            <StarRating value={Math.round(bookDetails.rating || 0)} readOnly />
                            <span className="det-rating-val">
                                {bookDetails.rating ? Number(bookDetails.rating).toFixed(1) : 'No ratings yet'}
                            </span>
                            {bookDetails.reviewCount > 0 && (
                                <span className="det-review-count">
                                    ({bookDetails.reviewCount} {bookDetails.reviewCount === 1 ? 'review' : 'reviews'})
                                </span>
                            )}
                        </div>

                        <div className="det-tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`det-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="det-tab-content">
                            {activeTab === 'description' && (
                                <>
                                    <p className={`det-description ${!expanded ? 'clamped' : ''}`}>
                                        {description}
                                    </p>
                                    {isLongDescription && (
                                        <button
                                            className="det-read-more"
                                            onClick={() => setExpanded(prev => !prev)}
                                        >
                                            {expanded ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                </>
                            )}
                            {activeTab === 'details' && (
                                <table className="det-details-table">
                                    <tbody>
                                        <tr><td>Genre</td><td>{bookDetails.genre}</td></tr>
                                        <tr><td>Author</td><td>{bookDetails.author}</td></tr>
                                        <tr><td>Price</td><td>₹{Number(bookDetails.price).toFixed(2)}</td></tr>
                                        <tr><td>Stock</td><td>{bookDetails.stock} copies</td></tr>
                                    </tbody>
                                </table>
                            )}
                            {activeTab === 'reviews' && (
                                <BookReviews bookId={id} />
                            )}
                        </div>
                    </div>

                    {/* Col 3 — Sidebar */}
                    <div className="det-sidebar">
                        <div className="det-price-wrap">
                            <p className="det-price">
                                ₹{Number(bookDetails.price).toFixed(2)}
                            </p>
                            {bookDetails.originalPrice && bookDetails.originalPrice > bookDetails.price && (
                                <p className="det-original-price">
                                    ₹{Number(bookDetails.originalPrice).toFixed(2)}
                                </p>
                            )}
                        </div>

                        {bookDetails.stock > 0
                            ? <p className="det-avail">Available</p>
                            : <p className="det-unavail">Out of stock</p>
                        }

                        <button
                            className="det-cart-btn"
                            disabled={bookDetails.stock === 0}
                            onClick={handleAddToCart}
                        >
                            {bookDetails.stock === 0 ? 'Out of Stock' : isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>

                        <div className="det-sidebar-divider" />

                        <div className="det-sidebar-meta">
                            <span>Genre</span>
                            <span>{bookDetails.genre}</span>
                        </div>
                    </div>

                </div>

                {/* ── Similar Books ── */}
                {similarBooks.length > 0 && (
                    <div className='det-similar'>
                        <h3 className='det-similar-title'>You Might Also Like</h3>
                        <div className='det-similar-grid'>
                            {similarBooks.map(book => (
                                <div
                                    key={book._id}
                                    className='det-similar-card'
                                    onClick={() => navigate(`/books/${book._id}`)}
                                >
                                    <img src={book.image} alt={book.title} className='det-similar-img' />
                                    <p className='det-similar-book-title'>{book.title}</p>
                                    <p className='det-similar-author'>{book.author}</p>
                                    <p className='det-similar-price'>₹{Number(book.price).toFixed(0)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default DetailsPage