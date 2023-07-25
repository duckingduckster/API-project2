const express = require('express');
const router = express.Router()
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')

//delete review image
router.delete('/:imageId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const reviewimageId = req.params.imageId

    const reviewImage = await ReviewImage.findByPk(reviewimageId, {
        include: {
            model: Review
        }
    })

    if (!reviewImage)return res.status(404).json({message:"Review Image couldn't be found"})

    if (reviewImage.Review.userId !== userId)return res.status(403).json({message: "Forbidden"})

    await reviewImage.destroy()
    return res.status(200).json({message:"Successfully deleted"})
})

module.exports = router
