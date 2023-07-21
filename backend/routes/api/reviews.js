const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
// const { ReviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');

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
    const current = req.user.id

    const reviews = await Review.findAll({
        where: {userId : current},
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
                'price', 'previewImage']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        // attributes: ['id', 'userId', 'spotId', 'review', 'stars'],
        // group: ['Review.id'],
    })
    return res.json({"Reviews":reviews})
})




module.exports = router;
