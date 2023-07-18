const express = require('express');
const router = express.Router()
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const sequelize = require( 'sequelize')

router.get('/:spotId/reviews', async (req, res, next)=>{
    let spotId = req.params.spotId

    const reviews = await Review.findAll({
        where : {spotId: spotId},
        include:[{
            model : User,
            attributes: ['id', 'firstName', 'lastName']
        },
        { model: ReviewImage,
            attributes: ['id', 'url']}
        ]
    })
})





module.exports = router;
