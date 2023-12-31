import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getUserSpots } from "../../../store/spots";
import DeleteSpotModal from '../DeleteSpot/index'


const ManageSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const userSpots = useSelector((state) => state.spots.userSpots)

    const spotsArray = userSpots ? Object.values(userSpots) : []

    const [deleteSpotModal, setDeleteSpotModal] = useState(false)
    const [spotToDelete, setSpotToDelete] = useState('')

    useEffect(() => {
        dispatch(getUserSpots())
    }, [dispatch])

    const handleSpotClickUpdate = (spotId) => {
        history.push(`/spots/${spotId}/update`)
    }

    const handleDelete = (id) => {
        setSpotToDelete(id);
        setDeleteSpotModal(true);
    }


    return (
        <div className='manage-spots-container'>
            <h1 className='manage-spots-title'>Manage Spots</h1>

            {spotsArray.length === 0 ? (
            <div className='new-spot-link'>
                <Link to={`/spots/new`} className='new-spot-button'>Create a New Spot</Link>
            </div>
            ) : (
                <div className='owned-spots-list'>
                    {spotsArray?.map(spot => (
                        <div className='manage-spots-list' key={spot.id} onClick={() => history.push(`/spots/${spot.id}`)}>
                            <div className='preview-img'>
                                <img className='owned-spot-img' src={spot.previewImage || null} alt={`${spot.name}`}/>
                            </div>
                            <div className='owned-spot-info'>
                                <p className='owned-spot-location'>
                                    {`${spot.city}, ${spot.state}`}
                                </p>
                                <p className='owned-spot-reviews'>
                                    <span className='stars'>★{ spot.avgRating || 'New' }</span>
                                </p>
                            </div>
                            <div className='owned-spot-price'>
                                <span className='spot-price'>${spot.price}</span> night
                            </div>
                            <div className='owned-spot-buttons'>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleSpotClickUpdate(spot.id);
                                }}>
                                    Update
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(spot.id);
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DeleteSpotModal
                spotId={spotToDelete}
                isOpen={deleteSpotModal}
                onClose={() => setDeleteSpotModal(false)}
                onDelete={() => {
                    setDeleteSpotModal(false)
                    dispatch(getUserSpots())
                }}
            />
        </div>
    );
}

export default ManageSpot
