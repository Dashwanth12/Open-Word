const Review = require('../models/Review');
const Book = require('../models/Book');


async function updateBookRating(bookId) {
    const reviews = await Review.find({ book: bookId });
    const count = reviews.length;
    const avg = count > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
        : 0;

    await Book.findByIdAndUpdate(bookId, {
        rating: Math.round(avg * 10) / 10, // 1 decimal place e.g. 4.3
        reviewCount: count
    });
}

// 1. ADD REVIEW
const addReview = async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { rating, comment, userName } = req.body;
        const userId = req.auth.userId; // from Clerk

        if (!rating || !userName) {
            return res.status(400).json({ message: 'Rating and name are required.' });
        }

        // Check book exists
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found.' });

        // Check duplicate
        const existing = await Review.findOne({ book: bookId, userId });
        if (existing) {
            return res.status(409).json({ message: 'You have already reviewed this book.' });
        }

        const review = await Review.create({
            book: bookId,
            userId,
            userName,
            rating: Number(rating),
            comment: comment || ''
        });

        await updateBookRating(bookId);

        res.status(201).json({ message: 'Review added!', review });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
};

// 2. GET REVIEWS FOR A BOOK
const getReviews = async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const reviews = await Review.find({ book: bookId }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Reviews fetched!', reviews });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
    }
};

// 3. DELETE REVIEW (own review only)
const deleteReview = async (req, res) => {
    try {
        const { id: bookId, reviewId } = req.params;
        const userId = req.auth.userId;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found.' });

        if (review.userId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own review.' });
        }

        await Review.findByIdAndDelete(reviewId);
        await updateBookRating(bookId);

        res.status(200).json({ message: 'Review deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete review', error: err.message });
    }
};

module.exports = { addReview, getReviews, deleteReview };