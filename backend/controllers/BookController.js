const Book = require('../models/Book');

// 1. CREATE BOOK
const createBook = async (req, res) => {
    try {
        const { title, author, description, price, stock, genre, bestSeller, originalPrice } = req.body;

        const image = req.file ? req.file.path : '';

        if (!title || !author || !image || price == null || stock == null) {
            return res.status(400).json({
                message: 'All fields are Required to Proceed!'
            });
        }

        const newBook = new Book({
            title,
            author,
            image,
            description,
            price,
            stock,
            genre,
            bestSeller: bestSeller === 'true' || bestSeller === true,
            originalPrice: originalPrice ? Number(originalPrice) : null,
        });

        await newBook.save();
        res.status(201).json({ message: 'Book Created Successfully!', book: newBook });
    } catch (err) {
        res.status(500).json({ message: 'Failed to Create Book', error: err.message });
    }
};

// 2. GET ALL BOOKS
const getBooks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.bestSeller === 'true') filter.bestSeller = true;

        const books = await Book.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Books Fetched Successfully!', books });
    } catch (err) {
        res.status(500).json({ message: 'Failed to Fetch Books', error: err.message });
    }
};

// 3. GET SINGLE BOOK BY ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) return res.status(404).json({ message: 'Book Not Found!' });

        res.status(200).json({ message: 'Book Fetched Successfully', book });
    } catch (err) {
        res.status(500).json({ message: 'Failed to Fetch Book By Id', error: err.message });
    }
};

// 4. UPDATE BOOK BY ID
const updateBookById = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedData = { ...req.body };

        // FormData sends booleans as strings
        if ('bestSeller' in updatedData) {
            updatedData.bestSeller = updatedData.bestSeller === 'true' || updatedData.bestSeller === true;
        }

        if ('originalPrice' in updatedData) {
            updatedData.originalPrice = updatedData.originalPrice === '' || updatedData.originalPrice === 'null'
                ? null
                : Number(updatedData.originalPrice);
        }

        if (req.file) updatedData.image = req.file.path;

        const updatedBook = await Book.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedBook) return res.status(404).json({ message: 'Book not Found to Update' });

        res.status(200).json({ message: 'Book Updated Successfully!', book: updatedBook });
    } catch (err) {
        res.status(500).json({ message: 'Failed to Update Book', error: err.message });
    }
};

// 5. DELETE BOOK BY ID
const deleteBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) return res.status(404).json({ message: 'Book not Found to Delete' });

        res.status(200).json({ message: 'Book Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to Delete Book', error: err.message });
    }
};

module.exports = { createBook, getBooks, getBookById, updateBookById, deleteBookById };