const express = require('express');
const router = express.Router()
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')

//delete spot image
router.delete('/:imageId', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const imageId = req.params.imageId

    const image = await SpotImage.findByPk(imageId, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    })
    const ownerId = image.Spot.dataValues.ownerId

    if (!image)return res.status(404).json({message:"Spot Image couldn't be found"})

    if (ownerId !== userId)return res.status(403).json({message: "Unauthorized"})

    await image.destroy()
    return res.status(200).json({message:"Successfully deleted"})
})

module.exports = router
