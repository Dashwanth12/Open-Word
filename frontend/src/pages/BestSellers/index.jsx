import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import ViewButton from '../../components/ViewButton'
import Loader from '../../components/Loader'
import BookCard from '../../components/BookCard'
import BASE_URL from '../../utils/api'
import './index.css'

function BestSellers() {

    const [loading, setLoading] = useState(false)
    const [bestBooks, setBestBooks] = useState([])
    const [error, setError] = useState(false)
    const scrollRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {

        const fetchBestSellerBooks = async () => {

            setLoading(true)
            setError(false)
            try {
                const res = await fetch(`${BASE_URL}/api/books?bestSeller=true`)

                if (res.ok) {
                    const data = await res.json()
                    setBestBooks(data.bestSellers || data.books || [])
                } else {
                    setError(true)
                }
            } catch (err) {
                console.log('Failed to Fetch Best Seller Books!', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchBestSellerBooks()
    }, [])

    if (loading) {
        return (
            <div className='books-loader'>
                <Loader />
                <p className='books-loader-p'>Please wait...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='bst-error'>
                <p>Something Went Wrong Please try again Later.</p>
            </div>
        )
    }

    if (bestBooks.length === 0) {
        return (
            <div className='bst-empty'>
                <p>No Best Seller Books found Right now Stay Tuned!!</p>
            </div>
        )
    }

    const scroll = (direction) => {
        if (!scrollRef.current) return
        const cardWidth = scrollRef.current.firstChild?.offsetWidth || 280
        scrollRef.current.scrollBy({
            left: direction === 'right' ? cardWidth + 32 : -(cardWidth + 32),
            behavior: 'smooth'
        })
    }

    return (
        <section className='bst-page'>
            <div className='bst-header'>
                <p className='section-tag'>Reader's Favourites</p>
                <h2 className='section-title'>Our Best Sellers</h2>
                <p className='section-subtitle'>The titles our readers keep coming back to</p>
                <div className='bst-btn-card'>
                   <ViewButton />
                </div>
            </div>

            <div className='bst-carousel-wrap'>
                <button className='bst-arrow bst-arrow-left' onClick={() => scroll('left')}>‹</button>

                <div className='bst-grid' ref={scrollRef}>
                    {bestBooks.map((book, index) => (
                        <motion.div
                            key={book._id}
                            className='bst-grid-item'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                        >
                            <BookCard book={book} />
                        </motion.div>
                    ))}
                </div>

                <button className='bst-arrow bst-arrow-right' onClick={() => scroll('right')}>›</button>
            </div>
        </section>
    )
}

export default BestSellers