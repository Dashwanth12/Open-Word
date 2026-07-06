// components/Footer/index.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-top">
                    <div className="footer-brand">
                        <h2 className="footer-logo">OPEN WORD</h2>
                        <p className="footer-tagline">
                            A curated home for readers who still believe in turning pages.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-heading">Explore</h3>
                        <Link to="/home" className="footer-link">Home</Link>
                        <Link to="/books" className="footer-link">All Books</Link>
                        <Link to="/bestSellers" className="footer-link">Best Sellers</Link>
                        <Link to="/about" className="footer-link">About</Link>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-heading">Support</h3>
                        <a href="#" className="footer-link">Shipping Info</a>
                        <a href="#" className="footer-link">Returns</a>
                        <a href="#" className="footer-link">FAQs</a>
                        <a href="#" className="footer-link">Contact Us</a>
                    </div>

                    <div className="footer-col">
                        <h3 className="footer-heading">Stay in Touch</h3>
                        <p className="footer-text">
                            Get notified about new arrivals and reader favourites.
                        </p>
                        <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="footer-input"
                            />
                            <button type="submit" className="footer-subscribe-btn">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-divider" />

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {year} Open Word. All rights reserved.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="footer-social-link">Instagram</a>
                        <a href="#" className="footer-social-link">Twitter</a>
                        <a href="#" className="footer-social-link">Pinterest</a>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer