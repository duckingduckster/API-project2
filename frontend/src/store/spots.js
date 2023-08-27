import { csrfFetch } from "./csrf";

const GET_SPOT = 'spots/GET_SPOT'
const SPOT_DETAILS = 'spots/SPOT_DETAILS'

const getSpot = (spots) => {
    return {
    type: GET_SPOT,
    spots
}
}

const spotDetails = (spotDetail) =>{
    return {
        type: SPOT_DETAILS,
        spotDetail
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
    const response = await csrfFetch(`api/spots/${spotId}`, {
        method: 'GET'
    })

    if(response.ok) {
        const spotDet = await response.json()
        dispatch(spotDetails(spotDet))
    }else {
        console.error('Failed to get spot details')
    }
}

const initialState = { spots: [] }

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
