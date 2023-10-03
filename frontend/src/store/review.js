import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const ADD_REVIEWS = 'reviews/ADD_REVIEWS'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEWS'
const DELETE_REVIEW = 'reviews/DELETE_REVIEWS'
const CLEAR_REVIEWS = 'reviews/CLEAR_REVIEWS'

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

const deleteReview = (review) => {
    return {
        type: DELETE_REVIEW,
        review
    }
}

export const clearReviews = () => {
    return {
        type: CLEAR_REVIEWS
    }
}

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const review = await response.json()
        dispatch(spotReviews(spotId, review.Reviews))
        return review
    }else {
        console.error('Failed to get review')
        return Promise.reject()
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

export const deletingReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    if(response.ok){
        const deletedReview = await response.json()
        dispatch(deleteReview(deletedReview))
        return deletedReview
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
            }

        case DELETE_REVIEW:
        const spotIdToDelete = Object.keys(state.reviews).find(spotId =>
        state.reviews[spotId].some(review => review.id === action.review.id)
        )

        if (spotIdToDelete && state.reviews[spotIdToDelete]) {
        return {
            ...state,
            reviews: {
                ...state.reviews,
                [spotIdToDelete]: state.reviews[spotIdToDelete].filter(review => review.id !== action.review.id),
            }
        }
        } else {
        return state
        }
        case CLEAR_REVIEWS:
            return {
                ...state,
                reviews: {}
            }
        default:
            return state
    }
}

export default reviewReducer
