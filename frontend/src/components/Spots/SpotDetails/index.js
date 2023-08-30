import React, { useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../../store/spots"
import { getSpotReviews } from "../../../store/review"
import CreateReviewModal from "../../Reviews/CreateReview"
import './SpotDetails.css'

const SpotDetails = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spotDetail = useSelector(state => state.spots.spotDetail)
    const reviews = useSelector(state => state.reviews)
    const spot = useSelector(state => state.spots.spots)
    const user = useSelector((state) => state.session.user)
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    useEffect(() =>{
        dispatch(getSpotDetails(spotId))
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId])

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    const calculateReviewInfo = (reviews) => {
        if (!reviews) return { avgRating: 'New', count: 0 };

        const totalRating = reviews.reduce((acc, review) => acc + review.stars, 0);
        const avgRating = (totalRating / reviews.length).toFixed(2);

        return { avgRating, count: reviews.length };
      };

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
                                {spotDetail?.SpotImages?.find(image => image.preview === true) ?
                                <img src={spotDetail?.SpotImages.find(image => image.preview === true).url} alt={spotDetail?.name} /> :
                                <p>No image available</p>
                                }
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
                            {sortedReviews && sortedReviews.length > 0 ? (
                            sortedReviews?.map(review => (
                                    <div key={review.id} className="single-review">
                                        <div className="review-meta">
                                            <strong>{review.firstName}</strong>
                                            <span>{new Date(review.createdAt).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <p>{review.review}</p>
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
