const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models')
const { ReviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true})
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true})
        .isFloat({ min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
        handleValidationErrors
]

//get all reviews of current user
router.get('/current', requireAuth, async(req, res, next)=>{
    
})


module.exports = router;
