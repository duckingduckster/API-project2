const express = require('express');
const router = express.Router()
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const sequelize = require( 'sequelize')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const { check } = require('express-validator');
const { Op } = require('sequelize')



const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
        check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required')
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({ checkFalsy: true})
        .withMessage("Review text is required")
        .isString({ checkFalsy: true })
        .withMessage('Has to be a string'),
    check('stars')
        .exists({ checkFalsy: true})
        .isFloat({ min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
        handleValidationErrors
]

const validateQuery = [
    check('page')
        .optional(true)
        .isFloat({min: 1})
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional(true)
        .isFloat({min: 1})
        .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
        .optional(true)
        .isFloat({max: 90})
        .withMessage("Maximum latitude is invalid"),
    check('minLat')
        .optional(true)
        .isFloat({min: -90})
        .withMessage("Minimum latitude is invalid"),
    check('minLng')
        .optional(true)
        .isFloat({min: -180})
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .optional(true)
        .isFloat({max: 180})
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .optional(true)
        .isFloat({min: 0})
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional(true)
        .isFloat({min: 0})
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors

]

// get all spots
router.get('/', validateQuery, async (req, res, next) =>{
    let { page = 1, size = 20, maxLat, minLat, minLng, maxLng, minPrice = 0, maxPrice = 0 } = req.query

    page = parseInt(page)
    size = parseInt(size)
    let pag = {}

    if(page !== 0 && size !== 0) {
        pag.limit = size
        pag.offset = size * (page - 1)
    }

    const where = {};

    if(maxLat) {
        where.lat = { ...where.lat, [Op.lte]: maxLat}}

    if(minLat) {
        where.lat = { [Op.gte]: minLat}}

    if(minLng) {
        where.lng = { [Op.gte]: minLng}}

    if(maxLng) {
        where.lng = { ...where.lng, [Op.lte]: maxLng}}

    if (minPrice) {
        where.price = { [Op.gte]: minPrice}}

    if(maxPrice) {
        where.price = { ...where.price, [Op.lte]: maxPrice}}

    const spots = await Spot.findAll({
        include:[
        {   model: Review,
            attributes: []
        }
    ],
    where,
    ...pag
    })
    for (const spot of spots) {
        const previewImage = await SpotImage.findOne({
            attributes: ['url'],
            where: { spotId: spot.id, preview: true },
        });
        if (previewImage) {
            spot.dataValues.previewImage = previewImage.dataValues.url;
        }

        const spotRating = await Spot.findByPk(spot.id, {
            include: [
                {
                    model: Review,
                    attributes: []
                }
            ],
            attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt",
        [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("stars")), 2), "avgRating"]
        ], group: ["Spot.id"]
    })
        const avgRating = spotRating.dataValues.avgRating;

        if(spotRating) spot.dataValues.avgRating = avgRating
}

    let results = {}
    results.Spots = spots
    return res.status(200).json({Spots:spots})
})


// get all spots owned by current user
router.get('/current', requireAuth, async(req, res, next)=>{
    const current = req.user.id

    const spots = await Spot.findAll({
        where: { ownerId: current },
        include:[
        {   model: Review,
            attributes: []
        }
    ],
})
for (const spot of spots) {
    const previewImage = await SpotImage.findOne({
        attributes: ['url'],
        where: { spotId: spot.id, preview: true },
    });
    if (previewImage) {
        spot.dataValues.previewImage = previewImage.dataValues.url;
    }
    if (previewImage) {
        spot.dataValues.previewImage = previewImage.dataValues.url;
    }
    const spotRating = await Spot.findByPk(spot.id, {

            include:[
                {
                        model: Review,
                        attributes: []
                    },
                ],
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
                            'description', 'price', 'createdAt', 'updatedAt',
                            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
                group: ['Spot.id'],
            })
            const avgRating = spotRating.dataValues.avgRating;

            if(spotRating) spot.dataValues.avgRating = avgRating
        }
    return res.status(200).json({"Spots":spots})
})

// get details of spot from id
router.get('/:spotId', async(req, res, next)=>{
    const spotId = req.params.spotId

    const spots = await Spot.findOne({
        where: {id: spotId},
        include:[
            {   model: Review,
                attributes: []
            },
            {   model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {   model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
                'description', 'price', 'createdAt', 'updatedAt',
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating'],
                [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews']],
        group: ['Spot.id', 'Reviews.id', 'SpotImages.id', 'Owner.id']
    })

    if(spots)return res.status(200).json(spots)

    else return res.status(404).json({message:"Spot couldn't be found"})

})

//create a spot
router.post('/' ,requireAuth, validateSpot, async(req, res, next)=>{
    const ownerId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price} = req.body

    let newSpot = await Spot.create ({ ownerId, address, city, state, country, lat, lng, name, description, price,})

    if (newSpot) {

        const spotWithoutAvgRating = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: parseFloat(newSpot.lat),
            lng: parseFloat(newSpot.lng),
            name: newSpot.name,
            description: newSpot.description,
            price: parseFloat(newSpot.price),
            updatedAt: newSpot.updatedAt,
            createdAt: newSpot.createdAt
        }

        return res.json(spotWithoutAvgRating);
    }

})

// create an image base on id
router.post('/:spotId/images', requireAuth, async(req, res, next)=>{
    const spotId = req.params.spotId
    const userId = req.user.id
    const { url, preview} = req.body

    const currentSpot = await Spot.findByPk(spotId)

    if (currentSpot) {
        if (userId === currentSpot.ownerId) {
            const spotImage = await SpotImage.create({
                url: url,
                preview: preview,
                spotId: spotId
            })
            const returnSpotImage = {
                id: spotImage.id,
                url: spotImage.url,
                preview: spotImage.preview
            }
            return res.status(200).json(returnSpotImage)

        } else return res.status(403).json({message:"Forbiden"})

    } else return res.status(404).json({message:"Spot couldn't be found"})
})

//edit a spot
router.put('/:spotId', requireAuth, validateSpot, async(req, res, next)=>{
    const spotId = req.params.spotId
    const userId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price} = req.body

    const currentSpot = await Spot.findByPk(spotId)

    if(currentSpot){
        if (userId === currentSpot.ownerId){
            const updatedSpot = await currentSpot.update({ address, city, state, country, lat, lng, name, description, price})
            return res.status(200).json(updatedSpot)

        }else return res.status(403).json({message:"Forbbiden"})

    }else return res.status(404).json({message:"Spot couldn't be found"})
})



//delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next)=>{
    const userId = req.user.id
    const spotId = req.params.spotId

    const currentSpot = await Spot.findByPk(spotId)
    console.log(currentSpot)

    if (currentSpot){
        if (userId === currentSpot.ownerId){
            await currentSpot.destroy()
            return res.status(200).json({message:'Successfully deleted'})

        }else return res.status(403).json({message: 'Forbidden'})

    } else return res.status(404).json({message:"Spot couldn't be found"})
})




//get all reviews by spot id
router.get('/:spotId/reviews', async (req, res, next)=>{
    let spotId = req.params.spotId

    const reviews = await Review.findAll({
        where:{spotId: spotId},
        include:[
            {
            model : User,
            attributes: ['id', 'firstName', 'lastName']
            },
            {
            model: ReviewImage,
            attributes: ['id', 'url']
            }
        ]
    })

    if(reviews) return res.json({Reviews: reviews})
    else return res.status(404).json({message:"Spot couldn't be found"})
})

//create review for spot based on spot id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, next)=>{
    const spotId = req.params.spotId
    const userId = req.user.id
    const { review, stars } = req.body

    const spot = await Spot.findByPk(spotId)
    const userReview = await await Review.findOne({
        where:
        {
            userId,
            spotId: parseInt(spotId)
        }
    })
    if (!spot)return res.status(404).json({ message: "Spot couldn't be found" })

    if(userId === spot.ownerId )return res.status(403).json({message:'Cannot review your own spot'})

    if(spot){
        if(!userReview){
            let newReview = await Review.create({ userId, spotId, review, stars})

            if (newReview) {
                newReview = newReview.toJSON()
                newReview.stars = parseFloat(newReview.stars)
                return res.status(201).json(newReview)
            }
        }else return res.status(500).json({message:"User already has a review for this spot"})

    }
    // else return  res.status(404).json({message:"Spot couldn't be found"})
})

//get all bookings from spot id
router.get('/:spotId/bookings', requireAuth, async(req, res, next)=>{
    const spotId = req.params.spotId
    const userId = req.user.id

    const spot = await Spot.findByPk(spotId)

    if (spot){
        if(userId === spot.ownerId){
            const spotBookings = await Booking.findAll({
                where:{ spotId },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            })
            return res.status(200).json({Booking:spotBookings})
        }else {
            const notAuthSpotBooking = await Booking.findAll({
                where:{ spotId },
                attributes: ['spotId', 'startDate', 'endDate']
            })
          return res.status(200).json({Booking:notAuthSpotBooking})
        }
    }return res.status(404).json({message:"Spot couldn't be found"})
})

//create booking from spot id
router.post('/:spotId/bookings', requireAuth, async(req, res, next)=>{
    const spotId = req.params.spotId
    const userId = req.user.id
    const { startDate, endDate }= req.body
    const bookingStartDate = new Date(startDate)
    const bookingEndDate = new Date(endDate)

    const spot = await Spot.findByPk(spotId)

    if(!spot)return res.status(404).json({message: "Spot couldn't be found"})

    if(spot.ownerId === userId)return res.status(403).json({message: "Can't book your own spot"})

    if((bookingEndDate <= bookingStartDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
              endDate: "endDate cannot be on or before startDate"
            }
          })
    }
    const bookings = await Booking.findAll({ where: { spotId }})

    let bookStartDate
    let bookEndDate

    for( let booking of bookings){
        bookStartDate = new Date(booking.startDate)
        bookEndDate = new Date(booking.endDate)
    }

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
    }else if ((bookingEndDate <= bookStartDate) && (bookEndDate >= bookStartDate)) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                endDate: "End date conflicts with an existing booking"
            }
          })
    }else if((bookingStartDate <= bookEndDate) && (bookStartDate >= bookStartDate)) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
            }
          })
    }
    const newBooking = await Booking.create({
        spotId: parseInt(spotId),
        userId,
        startDate,
        endDate
    })
    if (newBooking)return res.status(200).json(newBooking)

})



module.exports = router;
