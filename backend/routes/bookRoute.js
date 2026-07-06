const express = require('express')
const router = express.Router()

const upload = require('../controllers/uploadController')
const { createBook, getBooks, getBookById, updateBookById, deleteBookById } = require('../controllers/BookController')

router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/', upload.single('image'), createBook);
router.put('/:id', upload.single('image'), updateBookById);
router.delete('/:id', deleteBookById);

module.exports = router


