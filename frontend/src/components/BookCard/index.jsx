import { Link } from 'react-router-dom'
import './index.css'

function BookCard({ book }) {
    const hasDiscount = book.originalPrice && book.originalPrice > book.price
    const discountPercent = hasDiscount
        ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
        : null

    return (
        <div className='bst-card'>
            <div className='bst-image-wrapper'>
                <Link to={`/books/${book._id}`} className='link-image'>
                    <img src={book.image} alt={book.title} className='bst-image' />
                </Link>
                {hasDiscount && (
                    <span className='bst-discount-badge'>{discountPercent}% OFF</span>
                )}
            </div>

            <div className='bst-info'>
                <h3 className='bst-title'>{book.title}</h3>
                <p className='bst-author'>By {book.author}</p>

                <div className='bst-bottom-row'>
                    <div className='bst-price-row'>
                        <span className='bst-current-price'>₹{Number(book.price).toFixed(0)}</span>
                        {hasDiscount && (
                            <span className='bst-original-price'>₹{Number(book.originalPrice).toFixed(0)}</span>
                        )}
                    </div>

                    <div className='bst-rating'>
                        <span className='bst-stars'>★ {book.rating}</span>
                        <span className='bst-review-count'>({book.reviewCount})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookCard