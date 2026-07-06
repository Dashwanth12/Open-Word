require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
// middleware
app.use(express.json())
app.use(cors())

const connectDB = require('./config/db')
const bookRoute = require('./routes/bookRoute')
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoute')
app.use('/api/books/:id/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes)

// port

const PORT = (process.env.PORT)

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`)
})
connectDB()

app.use('/api/books', bookRoute)

// ROUTEs

app.use((err, req, res, next) => {
    console.error("=== GLOBAL ERROR DETECTED ===", err);
    if (err.message === 'Unauthenticated') {
        return res.status(401).json({
            message: 'Authentication required: Missing or invalid Clerk token session.'
        });
    }
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.get('/', (req,res) => {
    res.send('Welcome to Open Word Backend!')
})

