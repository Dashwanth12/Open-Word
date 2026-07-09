// pages/About/index.jsx
import React from 'react'
import { motion } from 'framer-motion'
import './index.css'

const values = [
    {
        id: 1,
        title: 'Thoughtfully Curated',
        description: 'Every book on our shelves is chosen by readers, not algorithms. We read before we recommend.'
    },
    {
        id: 2,
        title: 'Built for Slow Reading',
        description: 'In a world of endless scrolling, we believe in the quiet pleasure of a page turned by hand.'
    },
    {
        id: 3,
        title: 'A Community of Readers',
        description: 'Open Word started as a shelf of favourites shared between friends, and grew from there.'
    },
    {
        id:4,
        title: 'Not Sure What to Read ??',
        description: 'Open Word has number of genres We are Sure that You will Pick your Best!!'
    },
    {
        id: 5,
        title: 'If the book you love is out of stock',
        description: 'let us know. We will work to bring it back to our shelves for you.'
    }
]

function About() {
    return (
        <div className="about-page">

            {/* ── Hero ── */}
            <section className="about-hero">
                <p className="about-tag">Our Story</p>
                <h1 className="about-title">About Open Word</h1>
                <p className="about-subtitle">
                    A small, independent bookstore built for people who still fall in love with a story.
                </p>
                <p className="about-support-email">support@openwordbooks.com</p>
            </section>

            {/* ── Story ── */}
            <section className="about-story">
                <div className="about-story-grid">
                    <motion.div
                        className="about-story-image-wrap"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1763368230669-3a2e97368032?auto=format&fit=crop&w=800&q=80"
                            alt="A cozy reading corner with books"
                            className="about-story-image"
                        />
                    </motion.div>

                    <motion.div
                        className="about-story-text"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <p className="about-story-tag">How it began</p>
                        <h2 className="about-story-title">Every great story starts somewhere quiet</h2>
                        <p className="about-story-paragraph">
                            Open Word began as a small personal collection, passed between friends who couldn't
                            stop talking about the books that changed how they saw the world. What started as
                            informal recommendations slowly grew into something bigger: a place where readers
                            could find books worth staying up late for.
                        </p>
                        <p className="about-story-paragraph">
                            We're not trying to be the biggest bookstore online. We're trying to be the one
                            you trust — where every title has been read, loved, and chosen with care before
                            it ever reaches our shelves.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="about-values">
                <div className="about-values-header">
                    <p className="about-tag">What We Stand For</p>
                    <h2 className="about-values-title">Why Readers Choose Us</h2>
                </div>

                <div className="about-values-grid">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.id}
                            className="about-value-card"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                        >
                            <span className="about-value-number">0{index + 1}</span>
                            <h3 className="about-value-title">{value.title}</h3>
                            <p className="about-value-description">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Closing ── */}
            <section className="about-closing">
                <h2 className="about-closing-title">Find your next favourite book</h2>
                <p className="about-closing-text">
                    Browse our collection and discover stories worth losing yourself in.
                </p>
                <a href="/books" className="about-closing-btn">Explore Books</a>
            </section>

        </div>
    )
}

export default About