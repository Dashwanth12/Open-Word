import React, { useState, useEffect } from 'react'
import Loader from '../../components/Loader'
import BookCard from '../../components/BookCard'
import BASE_URL from '../../utils/api'
import './index.css'

const GENRES = ['Love', 'Fiction', 'History', 'Literature', 'Poetry']
const PRICE_RANGES = [
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 – ₹500', min: 300, max: 500 },
    { label: '₹500 – ₹800', min: 500, max: 800 },
    { label: 'Above ₹800', min: 800, max: Infinity },
]
const PAGE_SIZE = 12

function Books() {
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([])
    const [error, setError] = useState(false)

    const [selectedGenres, setSelectedGenres] = useState([])
    const [selectedPrice, setSelectedPrice] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            setError(false)
            try {
                const res = await fetch(`${BASE_URL}/api/books`)
                if (res.ok) {
                    const data = await res.json()
                    setBooks(data.books)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.log('Failed to Fetch Books:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedGenres, selectedPrice, searchQuery])

    function toggleGenre(genre) {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        )
    }

    function clearFilters() {
        setSelectedGenres([])
        setSelectedPrice(null)
        setCurrentPage(1)
    }

    
    const filtered = books.filter(book => {
        const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(book.genre)
        const priceMatch = !selectedPrice ||
            (book.price >= selectedPrice.min && book.price < selectedPrice.max)
        const searchMatch = searchQuery.trim() === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        return genreMatch && priceMatch && searchMatch
    })

   
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const hasFilters = selectedGenres.length > 0 || selectedPrice !== null || searchQuery.trim() !==''

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
            <div className='books-error'>
                <p>Failed to load books. Please try again.</p>
            </div>
        )
    }

    return (
        <div className='books-page'>

            {/* ── Sidebar ── */}
            <aside className='books-sidebar'>
                <div className='sidebar-header'>
                    <h2 className='sidebar-title'>Filter</h2>
                    {hasFilters && (
                        <button className='sidebar-clear' onClick={clearFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                <div className='sidebar-section'>
                    <h3 className='sidebar-section-title'>Genre</h3>
                    <div className='sidebar-options'>
                        {GENRES.map(genre => (
                            <label key={genre} className='sidebar-option'>
                                <input
                                    type='checkbox'
                                    className='sidebar-checkbox'
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => toggleGenre(genre)}
                                />
                                <span className='sidebar-option-label'>{genre}</span>
                                <span className='sidebar-option-count'>
                                    {books.filter(b => b.genre === genre).length}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className='sidebar-section'>
                    <h3 className='sidebar-section-title'>Price</h3>
                    <div className='sidebar-options'>
                        {PRICE_RANGES.map(range => (
                            <label key={range.label} className='sidebar-option'>
                                <input
                                    type='radio'
                                    className='sidebar-checkbox'
                                    name='price'
                                    checked={selectedPrice?.label === range.label}
                                    onChange={() => setSelectedPrice(range)}
                                />
                                <span className='sidebar-option-label'>{range.label}</span>
                                <span className='sidebar-option-count'>
                                    {books.filter(b => b.price >= range.min && b.price < range.max).length}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Best Sellers only */}
                <div className='sidebar-section'>
                    <h3 className='sidebar-section-title'>Availability</h3>
                    <div className='sidebar-options'>
                        <label className='sidebar-option'>
                            <input
                                type='checkbox'
                                className='sidebar-checkbox'
                                checked={selectedGenres.includes('__bestseller__')}
                                onChange={() => toggleGenre('__bestseller__')}
                            />
                            <span className='sidebar-option-label'>Best Sellers</span>
                            <span className='sidebar-option-count'>
                                {books.filter(b => b.bestSeller).length}
                            </span>
                        </label>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className='books-main'>
                <div className='books-main-header'>
                    <div className='books-heading-row'>
                        <div>
                            <h1 className='books-heading'>Our Collection</h1>
                            <p className='books-count'>Showing {paginated.length} of {filtered.length} titles</p>
                        </div>

                        <div className='books-search-wrap'>
                            <span className='books-search-icon'>🔍</span>
                            <input
                                type='text'
                                className='books-search'
                                placeholder='Search by title ...'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className='books-search-clear' onClick={() => setSearchQuery('')}>×</button>
                            )}
                        </div>
                    </div>

                    {hasFilters && (
                        <div className='books-active-filters'>
                            {searchQuery.trim() && (
                                <span className='filter-tag'>
                                    "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')}>×</button>
                                </span>
                            )}
                            {selectedGenres.filter(g => g !== '__bestseller__').map(g => (
                                <span key={g} className='filter-tag'>
                                    {g}
                                    <button onClick={() => toggleGenre(g)}>×</button>
                                </span>
                            ))}
                            {selectedGenres.includes('__bestseller__') && (
                                <span className='filter-tag'>
                                    Best Sellers
                                    <button onClick={() => toggleGenre('__bestseller__')}>×</button>
                                </span>
                            )}
                            {selectedPrice && (
                                <span className='filter-tag'>
                                    {selectedPrice.label}
                                    <button onClick={() => setSelectedPrice(null)}>×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {paginated.length === 0 ? (
                    <div className='books-empty'>
                        <p>No books match your filters.</p>
                        <button className='sidebar-clear-lg' onClick={clearFilters}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className='books-grid'>
                        {paginated.map(each => (
                            <BookCard key={each._id} book={each} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className='books-pagination'>
                        <button
                            className='page-btn'
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            ← Prev
                        </button>

                        <div className='page-numbers'>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                                    acc.push(p)
                                    return acc
                                }, [])
                                .map((p, idx) =>
                                    p === '...'
                                        ? <span key={`ellipsis-${idx}`} className='page-ellipsis'>···</span>
                                        : <button
                                            key={p}
                                            className={`page-number ${currentPage === p ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(p)}
                                        >
                                            {p}
                                        </button>
                                )
                            }
                        </div>

                        <button
                            className='page-btn'
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Books