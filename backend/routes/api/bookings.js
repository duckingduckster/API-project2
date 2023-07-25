const express = require('express');
const router = express.Router()
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');


//get all current user booking
router.get('/current', requireAuth, async(req, res, next)=>{
    const userId = req.user.id

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
        const spot = currBooking.Spot
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: {
                spotId: spot.id,
                preview: true
            }
        })
        if (previewImage){
            spot.dataValues.previewImage = previewImage.url
        }
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
}
    return res.json({Bookings: currBookings})
})

//edit a booking
router.put('/:bookingId', requireAuth, async(req, res, next)=>{
    const bookingId = req.params.bookingId
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const bookingStartDate = new Date(startDate)
    const bookingEndDate = new Date(endDate)
    const currDate = new Date()

    const booking = await Booking.findByPk(bookingId)

    if(!booking)return res.status(400).json({message:"Booking couldn't be found"})

    if(userId !== booking.userId)return res.status(403).json({message: "Forbidden"})

    if((bookingEndDate <= bookingStartDate))return res.status(400).json({
        message: 'Bad Request',
        errors:{
            endDate: "endDate cannot be on or before startDate"
        }
    })

    let bookStartDate
    let bookEndDate

    bookStartDate = new Date(booking.startDate)
    bookEndDate = new Date(booking.endDate)

    if(currDate > bookEndDate)return res.status(403).json({message:"Past bookings can't be modified"})

    if((bookingStartDate <= bookEndDate) && (bookingStartDate >= bookStartDate) && (bookingEndDate <= bookEndDate) && (bookingEndDate >= bookStartDate)) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                endDate: "End date conflicts with an existing booking",
                startDate: "Start date conflicts with an existing booking"
            }
          })
    }else if (bookingStartDate < bookStartDate && bookingEndDate > bookEndDate) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                endDate: "End date conflicts with an existing booking",
                startDate: "Start date conflicts with an existing booking"
            }
          })
    }else if ((bookingEndDate <= bookStartDate) && (bookedEndDate >= bookStartDate)) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                endDate: "End date conflicts with an existing booking"
            }
          })
    } else if((bookingStartDate <= bookEndDate) && (bookStartDate >= bookStartDate)) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
            }
          })
    }

    const updateBooking = await booking.update({
        startDate,
        endDate
    })
    return res.status(200).json(updateBooking)


})

//delete booking
router.delete('/:bookingId', requireAuth, async(req, res, next)=>{
    const bookingId = req.params.bookingId
    const userId = req.user.id
    const currDate = new Date()

    const booking = await Booking.findByPk(bookingId)

    if(!booking)return res.status(404).json({message:"Booking couldn't be found"})

    const start = new Date(booking.startDate)


    if(start < currDate)res.status(403).json({message:"Bookings that have been started can't be deleted"})

    const spot = await Spot.findByPk(booking.spotId)


    if(spot.ownerId === userId){
        await booking.destroy()
        return res.status(200).json({message:"Successfully deleted"})

    }else if(booking.userId !== userId)return res.status(403).json({message:"Forbidden"})
    await booking.destroy()
    return res.json({message:"Successfully deleted"})
})


module.exports = router;
