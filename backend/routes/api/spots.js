const express = require('express');
const router = express.Router()
const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const sequelize = require( 'sequelize')
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const { check } = require('express-validator');



const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
        check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
]

// get all spots
// router.get('/spots', async (req, res, next) =>{

// })

// get all spots owned by current user
router.get('/current', requireAuth, async(req, res, next)=>{
    const current = req.user.id
    // console.log(current)
    const spots = await Spot.findAll({
        where: {ownerId: current},
        include:[
        {   model: Review,
            attributes: []
        }
    ],
    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
                'description', 'price', 'createdAt', 'updatedAt',
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'], 'previewImage'],
    group: ['Spot.id'],
    })
    // results = {}
    // results.Spots = spots
    return res.status(200).json({"Spots":spots})
})

// get details of spot from id
router.get('/:spotId', async(req, res, next)=>{
    const spotId = req.params.spotId

    const spots = await Spot.findAll({
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
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
        group: ['Spot.id']
    })
    if(spotId) return res.status(200).json(spots)
    else return res.status(404).json({message:"Spot couldn't be found"})
})

// get reviews through spotId
router.get('/:spotId/reviews', async (req, res, next)=>{
    let spotId = req.params.spotId

    const reviews = await Review.findAll({
        where:{spotId: spotId},
        include:[{
            model : User,
            attributes: ['id', 'firstName', 'lastName']
        },
        { model: ReviewImage,
            attributes: ['id', 'url']}
        ]
    })

    if(reviews.length) return res.json({Reviews: reviews})
    else return res.status(404).json({message:"Spot couldn't be found"})
})

//delete spot through id
router.delete(':/spotId', requireAuth, async (req, res, next)=>{
    const user = req.user
    const spotId = req.params.spotId
    const currentSpot = await Spot.findbyPk(spotId)

    if (currentSpot){
        if (user.id === currentSpot.ownerId){
            await currentSpot.destroy()
            return res.status(200).json({message:'Successfully deleted'})
        }else return res.status(403).json({message: 'Forbidden'})
    } else return res.status(404).json({message:"Spot couldn't be found"})
})




module.exports = router;
