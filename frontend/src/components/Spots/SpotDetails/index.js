import React, { useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../../store/spots"
import { getSpotReviews } from "../../../store/review"
import CreateReviewModal from "../../Reviews/CreateReview"
import DeleteReview from "../../Reviews/DeleteReview"
import './SpotDetails.css'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotDetail = useSelector(state => state.spots.spotDetail)
    const reviews = useSelector((state) => Object.values(state.reviews.reviews) || [])
    const user = useSelector((state) => state.session.user)
    const [showModal, setShowModal] = useState(false)
    const openModal = () => setShowModal(true)
    const closeModal = () => setShowModal(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const openDeleteModal = () => setShowDeleteModal(true)
    const closeDeleteModal = () => setShowDeleteModal(false)

    useEffect(() =>{
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId])

    useEffect(() =>{
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId])

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    const mainImage = spotDetail?.SpotImages?.find(image => image.preview === true);
    const additionalImages = spotDetail?.SpotImages?.filter(image => !image.preview).slice(0, 4)

    const calculateReviewInfo = (reviews) => {
        if (!reviews || reviews.length === 0) return { avgRating: 'New', count: 0 }

        let totalRating = 0

        reviews.forEach(review => {
            totalRating += (review.stars || 0)
        })

        const avgRating = (totalRating / reviews.length).toFixed(2)

        return { avgRating, count: reviews.length }
    }


    const { avgRating, count } = calculateReviewInfo(reviews)

    const sortedReviews = reviews ? [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []

    return spotDetail && (
        <div className="spot-detail-container">
                <div className="information-container-details">
                    <div className="spot-details">
                        <h1>{spotDetail?.name}</h1>
                        <span className="address-top">
                            <i className="fas fa-map-marker-alt"></i>
                            {spotDetail?.city}, {spotDetail?.state}, {spotDetail?.country}
                        </span>
                        <div className="image-gallery">
                            <div className='main-spot-img'>
                                {mainImage ?
                                    <img src={mainImage.url} alt={spotDetail?.name} /> :
                                    <p>No main image available</p>
                                }
                            </div>
                                <div className="additional-images">
                                    {additionalImages?.map((image, index) => (
                                    <img key={index} src={image.url} alt={`Additional ${index}`} />
                                 ))}
                                </div>
                        </div>
                        <p>Hosted by {spotDetail?.Owner?.firstName} {spotDetail?.Owner?.lastName}</p>
                        <p>{spotDetail?.description}</p>
                    </div>
                    <div className="callout-box">
                        <div>
                            <i className="fas fa-star"></i>
                            {avgRating !== 'New' ? avgRating : 'New'}
                            {count !== 0 && <span>·</span>}
                            {count === 1 ? `${count} Review` : count > 1 ? `${count} Reviews` : ''}
                        </div>
                        <span>{spotDetail?.price} / night</span>
                        <button onClick={handleReserveClick}>Reserve</button>
                    </div>
                    <div className="review-container">
                        <h2>Reviews</h2>
                            {spotDetail?.ownerId !== user?.id && user &&
                            <div className="post-review-button">
                                <button onClick={openModal}>Post your review</button>
                                    <CreateReviewModal
                                    spotId={spotId}
                                    showModal={showModal}
                                    closeModal={closeModal}
                                    isOpen={showModal}
                                    />
                                    </div>}
                            {sortedReviews && sortedReviews[0]?.length > 0 ? (
                            sortedReviews[0]?.map(review => (
                                    <div key={review.id} className="single-review">
                                        <div className="review-meta">
                                            <strong>{review.firstName}</strong>
                                            <span>{new Date(review.createdAt).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <p>{review.review}</p>
                                        <div className="delete-review-modal">
                                        {(user && user.id === review.userId) && (
                                        <>
                                        <button onClick={openDeleteModal}>Delete Review</button>
                                        {showDeleteModal && (
                                            <DeleteReview
                                            reviewId={review.id}
                                            isOpen={showDeleteModal}
                                            onClose={closeDeleteModal}
                                            />
                                        )}
                                        </>
                                    )}
                                    </div>
                                    </div>
                                ))
                            ) : (
                             user && user?.id !== spotDetail?.ownerId &&
                             <p>Be the first to post a review!</p>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default SpotDetails
