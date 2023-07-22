const express = require('express');
const router = express.Router()
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const spotimage = require('../../db/models/spotimage');


//get all current user booking
router.get('/current', requireAuth, async(req, res, next)=>{
    const userId = req.user.id
    const spotId = req.params.spotId

    const currBookings = await Booking.findAll({
        where: { userId },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        ]
    })
    for (const currBooking of currBookings){
        const spot = currBooking.spot
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: {
                spotId,
                preview: true
            }
        })
        if (previewImage){
            spot.dataValues.previewImage = previewImage.url
        }
    }
    return res.status(200).json({Bookings: currBookings})
})

//edit a booking
router.put('/:bookingId', requireAuth, async(req, res, next)=>{
    
})

module.exports = router;
