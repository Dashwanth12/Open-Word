import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '@clerk/clerk-react'
import BASE_URL from '../../utils/api'
import './index.css'

function Checkout() {
    const { cart, cartTotal, clearCart } = useCart()
    const { getToken } = useAuth()
    const navigate = useNavigate()
    const [paying, setPaying] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: '', pincode: ''
    })

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handlePayment(e) {
        e.preventDefault()
        setPaying(true)

        try {
            const token = await getToken()

            const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: cartTotal })
            })

            const { order } = await res.json()

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: 'INR',
                name: 'Open Word',
                description: 'Book Purchase',
                order_id: order.id,
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone
                },
                theme: { color: '#c4896c' },
                handler: async (response) => {
                    const verifyRes = await fetch(`${BASE_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    })
                    const data = await verifyRes.json()
                    if (data.success) {
                        clearCart()
                        navigate('/order-success', { state: { paymentId: data.paymentId } })
                    }
                },
                modal: { ondismiss: () => setPaying(false) }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()

        } catch (err) {
            console.log('Payment error:', err)
            setPaying(false)
        }
    }

    if (!cart.items || cart.items.length === 0) {
        navigate('/cart')
        return null
    }

    return (
        <div className='checkout-page'>
            <div className='checkout-inner'>

                {/* ── Left: form ── */}
                <div className='checkout-left'>
                    <button className='checkout-back' onClick={() => navigate(-1)}>← Back</button>
                    <h1 className='checkout-title'>Delivery Details</h1>

                    <form className='checkout-form' onSubmit={handlePayment}>
                        <div className='checkout-field'>
                            <label>Full Name</label>
                            <input name='name' value={form.name} onChange={handleChange} placeholder='Your full name' required />
                        </div>
                        <div className='checkout-field'>
                            <label>Email</label>
                            <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='your@email.com' required />
                        </div>
                        <div className='checkout-field'>
                            <label>Phone</label>
                            <input name='phone' type='tel' value={form.phone} onChange={handleChange} placeholder='10-digit mobile number' required />
                        </div>
                        <div className='checkout-field'>
                            <label>Address</label>
                            <textarea name='address' value={form.address} onChange={handleChange} placeholder='Street address, apartment, etc.' rows={3} required />
                        </div>
                        <div className='checkout-field-row'>
                            <div className='checkout-field'>
                                <label>City</label>
                                <input name='city' value={form.city} onChange={handleChange} placeholder='City' required />
                            </div>
                            <div className='checkout-field'>
                                <label>Pincode</label>
                                <input name='pincode' value={form.pincode} onChange={handleChange} placeholder='6-digit pincode' required />
                            </div>
                        </div>
                        <button type='submit' className='checkout-pay-btn' disabled={paying}>
                            {paying ? 'Processing...' : `Pay ₹${cartTotal.toFixed(0)}`}
                        </button>
                    </form>
                </div>

                {/* ── Right: summary ── */}
                <div className='checkout-summary'>
                    <h2 className='checkout-summary-title'>Order Summary</h2>
                    <div className='checkout-summary-items'>
                        {cart.items.map(item => (
                            <div key={item._id} className='checkout-summary-item'>
                                <img src={item.book.image} alt={item.book.title} className='checkout-summary-img' />
                                <div className='checkout-summary-info'>
                                    <p className='checkout-summary-book-title'>{item.book.title}</p>
                                    <p className='checkout-summary-author'>By {item.book.author}</p>
                                    <p className='checkout-summary-qty'>Qty: {item.quantity}</p>
                                </div>
                                <p className='checkout-summary-price'>₹{(item.book.price * item.quantity).toFixed(0)}</p>
                            </div>
                        ))}
                    </div>
                    <div className='checkout-summary-divider' />
                    <div className='checkout-summary-row'>
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(0)}</span>
                    </div>
                    <div className='checkout-summary-row'>
                        <span>Shipping</span>
                        <span className='checkout-free'>Free</span>
                    </div>
                    <div className='checkout-summary-divider' />
                    <div className='checkout-summary-row checkout-total'>
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout