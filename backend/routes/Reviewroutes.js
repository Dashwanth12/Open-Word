const express = require('express')
const router = express.Router({mergeParams: true})


const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { addReview, getReviews, deleteReview } = require('../controllers/Reviewcontroller');

router.get('/', getReviews);
router.post('/', ClerkExpressRequireAuth(), addReview);
router.delete('/:reviewId', ClerkExpressRequireAuth(), deleteReview);

module.exports = router;