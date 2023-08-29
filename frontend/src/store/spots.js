import { csrfFetch } from "./csrf";

const GET_SPOT = 'spots/GET_SPOT'
const SPOT_DETAILS = 'spots/SPOT_DETAILS'
const GET_SPOT_ID = 'spots/GET_SPOT_ID'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

const getSpot = (spots) => {
    return {
    type: GET_SPOT,
    spots
}
}

const spotDetails = (spotDetail) => {
    return {
        type: SPOT_DETAILS,
        spotDetail
    }

}

const spotId = (spot) => {
    return {
        type: GET_SPOT_ID,
        spot
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    }
}

const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

const deleteSpot = (spot) => {
    return {
        type: DELETE_SPOT,
        spot
    }
}

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    if(response.ok) {
        const spotData = await response.json()
        dispatch(getSpot(spotData.Spots))
    }else {
        console.error('Failed to get spots')
    }
}

export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET'
    })

    if(response.ok) {
        const spotDet = await response.json()
        dispatch(spotDetails(spotDet))
    }else {
        console.error('Failed to get spot details')
    }
}

export const getSpotId = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if(response.ok) {
        const spotId = await response.json()
        dispatch(spotId(spotId))
    }else {
        console.error('Failed to get spot id')
    }
}


const initialState = { spots: [] , spotDetail: {}}

const spotsReducer = (state = initialState, action) => {
    let newState = {...state}
    switch (action.type){
        case GET_SPOT:
            newState.spots = action.spots
            return newState;
        case SPOT_DETAILS:
            newState.spotDetail = action.spotDetail
            return newState
        default:
            return state
    }
}

export default spotsReducer
