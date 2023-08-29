import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS'

const spotReviews = (review) => {
    return{
        type: GET_REVIEWS,
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

const initialState = { reviews: {} }

const reviewReducer = (state = initialState, action) => {
    let newState = {...state}
    switch(action.type){
        case GET_REVIEWS:
            return { ...newState, reviews: action.reviews}
            default:
                return state
    }
}

export default reviewReducer
