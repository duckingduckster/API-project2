import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const ADD_REVIEWS = 'reviews/ADD_REVIEWS'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEWS'
const DELETE_REVIEW = 'reviews/DELETE_REVIEWS'


const spotReviews = (spotId, reviews) => {
    return{
        type: GET_REVIEWS,
        spotId,
        reviews
    }
}

const addReviews = (spotId, review) => {
    return {
        type: ADD_REVIEWS,
        spotId,
        review
    }
}

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const review = await response.json()
        dispatch(spotReviews(spotId, review.Reviews))
    }else {
        console.error('Failed to get review')
    }
}

export const addingReview = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    })

    if(response.ok){
        const ewReview = await response.json()
        dispatch(addReviews(spotId, ewReview))
        return ewReview
    } else{
        const errors = await response.json()
        return errors
    }
}

const initialState = { reviews: {} }

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_REVIEWS:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [action.spotId]: action.reviews
                }
            };
        case ADD_REVIEWS:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [action.spotId]: [action.review, ...(state.reviews[action.spotId] || [])],
                }
            };
        default:
            return state;
    }
}

export default reviewReducer
