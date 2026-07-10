import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader'
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext'
import './index.css'

function Cart() {
    const { cart, cartCount, cartTotal, updateCartItem, deleteCartItem, clearCart, loading } = useCart()
    const navigate = useNavigate()

    if (loading) {
        return (
            <div className='books-loader'>
                <Loader />
                <p className='books-loader-p'>Please wait...</p>
            </div>
        )
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className='cart-empty'>
                <p className='cart-empty-title'>Your cart is empty</p>
                <p className='cart-empty-sub'>Heyy! Looks like you haven't added anything yet. Go Shopp</p>
                <Link to='/books' className='cart-browse-btn'>Browse Books</Link>
            </div>
        )
    }

    return (
        <div className='cart-page'>
            <button className="det-back" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <div className='cart-inner'>
                <div className='cart-left'>
                    <div className='cart-header-row'>
                        <h1 className='cart-title'>Your Cart
                            <span className='cart-num'>({cartCount})</span>
                        </h1>
                        <button className='cart-clear-btn' onClick={clearCart}>
                            Clear all
                        </button>
                    </div>

                    <div className='cart-items'>
                        {cart.items.map(item => (
                            <div key={item._id} className='cart-item'>
                                <Link to={`/books/${item.book._id}`} className='cart-item-img-link'>
                                    <img
                                        src={item.book.image}
                                        alt={item.book.title}
                                        className='cart-item-img'
                                    />
                                </Link>

                                <div className='cart-item-info'>
                                    <h3 className='cart-item-title'>{item.book.title}</h3>
                                    <p className='cart-item-author'>By {item.book.author}</p>
                                    <p className='cart-item-genre'>{item.book.genre}</p>

                                    <div className='cart-item-bottom'>
                                        <div className='cart-qty-control'>
                                            <button
                                                className='cart-qty-btn'
                                                onClick={() => {
                                                    if (item.quantity === 1) {
                                                        deleteCartItem(item._id)
                                                    } else {
                                                        updateCartItem(item._id, item.quantity - 1)
                                                    }
                                                }}
                                            >
                                                −
                                            </button>
                                            <span className='cart-qty'>{item.quantity}</span>
                                            <button
                                                className='cart-qty-btn'
                                                onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className='cart-remove-btn'
                                            onClick={() => deleteCartItem(item._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className='cart-item-price'>
                                    <p className='cart-item-unit-price'>
                                        ₹{Number(item.book.price).toFixed(0)}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className='cart-item-total-price'>
                                            ₹{(item.book.price * item.quantity).toFixed(0)} total
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: summary ── */}
                <div className='cart-summary'>
                    <h2 className='cart-summary-title'>Order Summary</h2>

                    <div className='cart-summary-row'>
                        <span>Subtotal</span>
                        <span className='cart-summary-value'>₹{cartTotal.toFixed(0)}</span>
                    </div>

                    <div className='cart-summary-row'>
                        <span>Shipping</span>
                        <span className='cart-free'>Free</span>
                    </div>

                    <div className='cart-summary-divider' />

                    <div className='cart-summary-row cart-summary-total'>
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(0)}</span>
                    </div>

                    <button className='cart-checkout-btn' onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>

                    <Link to='/books' className='cart-continue-link'>
                        ← Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Cart;