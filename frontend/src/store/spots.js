import { csrfFetch } from "./csrf";

const GET_SPOT = 'spots/GET_SPOT'
const SPOT_DETAILS = 'spots/SPOT_DETAILS'
const GET_SPOT_ID = 'spots/GET_SPOT_ID'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const CREATE_IMAGE = 'spots/CREATE_IMAGE'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'
const USER_SPOTS = 'spots/USER_SPOTS'

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

const createImage = (spotImage) => {
    return {
        type: CREATE_IMAGE,
        spotImage
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

const userSpots = (spots) => {
    return {
        type: USER_SPOTS,
        spots
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
        const fetchedSpotId = await response.json()
        dispatch(spotId(fetchedSpotId))
    }else {
        console.error('Failed to get spot id')
    }
}

export const createSpotT = (spotData) => async (dispatch) => {
    const response = await csrfFetch('/api/spots/', {
        method: 'POST',
        body: JSON.stringify(spotData)
    });

    if(response.ok) {
        const newSpot = await response.json();
        dispatch(createSpot(newSpot));
        return newSpot;
    } else {
        console.error('Failed to create spot');
        // throw response;
    }
};

export const createImageT = (spotId, imageUrl) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      body: JSON.stringify(imageUrl)
    });

    if(response.ok) {
      const spotImage = await response.json();
      dispatch(createImage(spotImage));
      return spotImage;
  } else {
    console.error('failed to create img')
  }
}

export const updateSpotT = (spotId, updatedData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
    });

    if(response.ok) {
        const updatedSpot = await response.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    } else {
        console.error('Failed to update spot');
    }
}

export const deleteSpotT = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if(response.ok) {
        const deletedSpot = await response.json()
        dispatch(deleteSpot(spotId))
    }
}

export const getUserSpots = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/current`)

    if(response.ok){

        const spots = await response.json()
        dispatch(userSpots(spots.Spots))
    }
}

const initialState = { spots: [] , spotDetail: {}, userSpots: {}}

const spotsReducer = (state = initialState, action) => {
    let newState = {...state}
    switch (action.type){
        case GET_SPOT:
            newState.spots = action.spots
            return newState;
        case SPOT_DETAILS:
            newState.spotDetail = action.spotDetail
            return newState
        case CREATE_SPOT:
            newState.spots = [...newState.spots, action.spot];
            return newState;
        case CREATE_IMAGE:
            newState[action.spotImage.id] = action.spotImage;
            return newState;
        case UPDATE_SPOT:
            const updatedSpotsList = newState.spots.map(spot =>
                spot.id === action.spot.id ? action.spot : spot)
            newState.spots = updatedSpotsList
            return newState
        case DELETE_SPOT:
            newState.spots = newState.spots.filter(spot => spot.id !== action.spot)
            return newState
        case USER_SPOTS:
            newState.userSpots = action.spots;
            return newState;
        default:
            return state
    }
}

export default spotsReducer
