const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        requried: true
    },

    genre: {
        type: String,
        enum: ['Love', 'Fiction', 'History', 'Literature', 'Poetry'],
        required: true
    },

    stock: {
        type: Number,
        default: 40,
        min: 0
    },

    bestSeller: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },

    originalPrice: {
        type: Number,
        default: null
    }

}, {timestamps: true})

module.exports = mongoose.model('Book', bookSchema)