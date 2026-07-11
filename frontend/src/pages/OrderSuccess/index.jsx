// pages/OrderSuccess/index.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './index.css'

function OrderSuccess() {
    const { state } = useLocation()

    return (
        <div className='success-page'>
            <div className='success-card'>
                <div className='success-icon'>✓</div>
                <h1 className='success-title'>Order Placed!</h1>
                <p className='success-sub'>Thank you for your purchase. Your books are on their way.</p>
                {state?.paymentId && (
                    <p className='success-payment-id'>
                        Payment ID: <span>{state.paymentId}</span>
                    </p>
                )}
                <Link to='/books' className='success-btn'>Continue Shopping</Link>
                <Link to='/home' className='success-link'>Back to Home</Link>
            </div>
        </div>
    )
}

export default OrderSuccess