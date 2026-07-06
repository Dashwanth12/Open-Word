const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },
    
    items: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
            },

            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Cart', cartSchema)
