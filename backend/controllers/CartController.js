const Cart = require('../models/Cart')
const Book = require('../models/Book')

// getCart

const getCart = async (req,res) => {

    try{
        const cart = await Cart.findOne({userId: req.auth.userId}).populate('items.book')

        if (!cart){
            return res.json({cart: {items: []}})
        }
        cart.items = cart.items.filter(item => item.book !== null)
        await cart.save()
        res.json({cart})
    }catch(err){
        console.log('getCart error:', err)
        res.status(500).json({ message: 'Failed to fetch cart' })
    }
}

const addToCart = async (req,res) => {

    try{
        const {bookId, quantity = 1} = req.body
        const book = await Book.findById(bookId)
        
        if (!book) return res.status(404).json({message: 'Book not Found!!'})
        if (book.stock < quantity) return res.status(400).json({message: 'Not Enough Stock!'})

        let cart = await Cart.findOne({userId: req.auth.userId})

        if (!cart){
            
            cart = new Cart({
                userId: req.auth.userId,
                items: [{book: bookId, quantity}]
            })
        }else{
            const existingItem = cart.items.find(
                item => item.book.toString() === bookId
            )
            if (existingItem){
                if (book.stock < quantity){
                    return res.status(400).json({ message: 'Not enough stock' })
                }
                existingItem.quantity += quantity
            }else{
                cart.items.push({book: bookId, quantity})
            }
        }
        book.stock -= quantity
        await book.save()
        await cart.save()
        await cart.populate('items.book')
        res.json({cart})

    }catch(err){
        console.log('Failed to add to cart:',err)
        res.status(500).json({
            message: 'Failed to add to Cart!!'
        })
    }
}

// put /:id

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body
        const cart = await Cart.findOne({ userId: req.auth.userId })
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const item = cart.items.id(req.params.itemId)
        if (!item) return res.status(404).json({ message: 'Item not found' })

        const diff = quantity - item.quantity  // positive = more, negative = less

        const book = await Book.findById(item.book)
        if (diff > 0 && book.stock < diff) {
            return res.status(400).json({ message: 'Not enough stock' })
        }

        // adjust stock by difference
        await Book.findByIdAndUpdate(item.book, {
            $inc: { stock: -diff }
        })

        item.quantity = quantity
        await cart.save()
        await cart.populate('items.book')
        res.json({ cart })

    } catch (err) {
        console.log('updateCartItem Error:', err)
        res.status(500).json({ message: 'Failed to update Item' })
    }
}
// deelte id

const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.auth.userId })
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const item = cart.items.find(
            item => item._id.toString() === req.params.itemId
        )

        if (item) {
            // restore stock
            await Book.findByIdAndUpdate(item.book, {
                $inc: { stock: item.quantity }
            })
        }

        cart.items = cart.items.filter(
            item => item._id.toString() !== req.params.itemId
        )

        await cart.save()
        await cart.populate('items.book')
        res.json({ cart })

    } catch (err) {
        console.log('Remove from cart Error:', err)
        res.status(500).json({ message: 'Failed to remove from cart' })
    }
}


const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.auth.userId })
        if (!cart) return res.json({ message: 'Cart already empty!!' })

        // restore stock for all items
        for (const item of cart.items) {
            await Book.findByIdAndUpdate(item.book, {
                $inc: { stock: item.quantity }
            })
        }

        cart.items = []
        await cart.save()
        res.json({ message: 'Cart cleared!!' })

    } catch (err) {
        console.log('clearCart error:', err)
        res.status(500).json({ message: 'Failed to clear cart' })
    }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart }