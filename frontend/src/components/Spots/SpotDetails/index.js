import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { getSpotDetails } from "../../../store/spots"

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotDetail = useSelector(state => state.spot.spotDetails)
    const spot = useSelector(state => state.spots.spots)

    useEffect(() =>{
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId])

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    return (
        <div className="spot-detail-container">
            {spot && (
                <div className="information-container-details">
                    <div className="spot-details">
                        <h1>{spot.name}</h1>
                        <span className="address-top">
                            <i className="fas fa-map-marker-alt"></i>
                            {spot.city}, {spot.state}, {spot.country}
                        </span>
                        <div className="image-gallery">
                            {spot.SpotImages && spot.SpotImages.map((image, index) => (
                                <img
                                key={image.id}
                                src={image.url}
                                alt="Spot Preview"
                                onClick={() => handleImageChange(index)}
                                 className={index === 0 ? "large" : "small"}
                                />
                            ))}
                        </div>
                        <p>Hosted by {spot.hostFirstName}, {spot.hostLastName}</p>
                        <p>{spot.description}</p>
                    </div>
                    <div className="callout-box">
                        <span>{spot.price} / night</span>
                        <button onClick={handleReserveClick}>Reserve</button>
                    </div>
                </div>
            )}
        </div>
    );
};
