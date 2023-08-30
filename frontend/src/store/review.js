import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const ADD_REVIEWS = 'reviews/ADD_REVIEWS'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEWS'
const DELETE_REVIEW = 'reviews/DELETE_REVIEWS'


const spotReviews = (review) => {
    return{
        type: GET_REVIEWS,
        review
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
        dispatch(spotReviews(review))
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
    let newState = {...state}
    switch(action.type){
        case GET_REVIEWS:
            return { ...newState, reviews: action.reviews}
        case ADD_REVIEWS:
            return {
                ...state,
                [action.spotId]: [action.review, ...(state[action.spotId] || [])], // add the new review to the list of reviews for the given spotId AT THE TOP of the reviews
            }
            default:
                return state
    }
}

export default reviewReducer
