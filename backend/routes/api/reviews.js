const express = require('express')
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
// const { ReviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spot = require('../../db/models/spot');

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
                'price']
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

//add an image to review base on review id
router.post('/:reviewId/images', requireAuth, async(req, res, next)=>{
    const reviewId = req.params.reviewId
    const userId = req.user.id
    const { url } = req.body

    const review = await Review.findOne({
        where: { id: reviewId }
    })
    const maxReviewImages = await ReviewImage.findAll({
        where: { reviewId }
    })

    if (review){
        if(userId === review.userId){
            if(maxReviewImages.length < 10){
                const newReviewImage = await ReviewImage.create({
                    reviewId: parseInt(reviewId),
                    url
                })
                return res.status(200).json({
                id: newReviewImage.id,
                url: newReviewImage.url
            })
        }else return res.status(403).json({message:"Maximum number of images for this resource was reached"})

    }else return res.status(403).json({message:'Unathorized'})

}else return res.status(404).json({message:"Review couldn't be found"})
})

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, next)=>{
    const reviewId = req.params.reviewId
    const userId = req.user.id
    const { review, stars } = req.body

    const checkReview = await Review.findByPk(reviewId)

    if(checkReview){
        if(userId === checkReview.userId){
            await checkReview.update({ review, stars})
            return res.status(200).json(checkReview)

        }else return res.status(403).json({message:'Unauthorized'})

    }else return res.status(404).json({message:"Review couldn't be found"})
})

//delete a review
router.delete('/:reviewId', requireAuth, async(req, res, next)=>{
    const reviewId = req.params.reviewId
    const userId = req.user.id

    const checkReview = await Review.findByPk(reviewId)

    if(checkReview){
        if(userId === checkReview.userId){
            await checkReview.destroy()
            return res.status(200).json({message:"Successfully deleted"})

        }else return res.status(403).json({message:'Unauthorized'})

    }else return res.status(404).json({message:"Review couldn't be found"})
})

module.exports = router;
