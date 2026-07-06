const express = require('express')
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/CartController')
const { requireAuth } = require('../middlewares/authMiddleware')

const router = express.Router()
router.use(requireAuth)

router.get('/', getCart)
router.post('/add', addToCart)
router.put('/:itemId', updateCartItem)
router.delete('/:itemId', removeCartItem)
router.delete('/', clearCart)

module.exports = router