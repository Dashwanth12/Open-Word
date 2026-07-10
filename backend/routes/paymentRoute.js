const express = require('express')
const router = express.Router()
const {createOrder, verifyPayment} = require('../controllers/paymentController')
const {requireAuth} = require('../middlewares/authMiddleware') 

router.use(requireAuth)
router.post('/createorder', createOrder)
router.post('/verify', verifyPayment)

module.exports = router