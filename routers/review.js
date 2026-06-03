const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');



//==========================================
// review route
router.post('/', isLoggedIn, validateReview, createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview)

module.exports = router;