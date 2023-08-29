import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { getSpotDetails } from "../../../store/spots"
import { getSpotReviews } from "../../../store/review"
import './SpotDetails.css'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotDetail = useSelector(state => state.spots.spotDetail)
    console.log(spotDetail)
    const spot = useSelector(state => state.spots.spots)
    const user = useSelector((state) => state.session.user)

    useEffect(() =>{
        dispatch(getSpotDetails(spotId))
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId])

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };


    return spotDetail && (
        <div className="spot-detail-container">
             (
                <div className="information-container-details">
                    <div className="spot-details">
                        <h1>{spotDetail?.name}</h1>
                        <span className="address-top">
                            <i className="fas fa-map-marker-alt"></i>
                            {spotDetail?.city}, {spotDetail?.state}, {spotDetail?.country}
                        </span>
                        <div className="image-gallery">
                            <div className='main-spot-img'>

                            </div>
                        </div>
                        <p>Hosted by {spotDetail?.hostFirstName}, {spotDetail?.hostLastName}</p>
                        <p>{spotDetail?.description}</p>
                    </div>
                    <div className="callout-box">
                        <span>{spotDetail?.price} / night</span>
                        <button onClick={handleReserveClick}>Reserve</button>
                    </div>
                </div>
            )
        </div>
    );
};

export default SpotDetails
