const Razorpay = require('razorpay')
const crypto = require('crypto')
const Cart = require('../models/Cart')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        })
        res.json({ order })
    } catch (err) {
        console.log('createOrder error:', err)
        res.status(500).json({ message: 'Failed to create order' })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' })
        }

        const cart = await Cart.findOne({ userId: req.auth.userId })
        if (cart) {
            cart.items = []
            await cart.save()
        }

        res.json({ success: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id })
    } catch (err) {
        console.log('verifyPayment error:', err)
        res.status(500).json({ message: 'Payment verification failed' })
    }
}

module.exports = { createOrder, verifyPayment }