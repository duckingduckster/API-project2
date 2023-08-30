import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addingReview } from "../../../store/review";

function CreateReviewModal({ spotId, isOpen, closeModal, showModal, onReviewPosted}){
    const dispatch = useDispatch()


    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (!isOpen) {
            setReview('');
            setStars(0);
            setErrors([]);
        }
    }, [isOpen])

    // const handleSubmit = async (e) =>{
    //     e.preventDefault()
    //     const reviewData = { review, stars }
    //     setErrors({});
    //     let postedReview = await dispatch(addingReview(spotId, reviewData))
    //       .then(closeModal())
    //       .catch(async (res) => {
    //         const data = await res.json();
    //         if(data && data.errors){
    //             setErrors(Array.isArray(data.errors) ? data.errors : [data.errors])
    //         }else{
    //           setErrors(['The provided review was invalid.'])
    //         }

    //       });
    //     if(postedReview){
    //         window.location.reload()
    //     }
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewDetails = { review, stars };

        dispatch(addingReview(spotId, reviewDetails))
          .then(() => {
            closeModal();
            
            if (onReviewPosted) {
              onReviewPosted();
            }
          })
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.message) setErrors([data.message]);
            else setErrors("An error occurred. Please try again.");
          });
      };

    const handleStarClick = (i) => {
        setStars(i)
    }

    const reviewStars = () => {
        const starArr = [];

        for (let i = 1; i <= 5; i++) {
            starArr.push(<i key={i} className={`fa${stars >= i ? 's' : 'r'} fa-star`} onClick={() => handleStarClick(i)} />)
    }
        return starArr;
    }


    const modalRef = useRef();
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          closeModal();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [closeModal]);

    return (
        <div className={`review-modal-container ${showModal ? "is-active" : ""}`}>
          <div className="review-modal" ref={modalRef}>
            <form className="review-form" onSubmit={handleSubmit}>
              <h2>How was your stay?</h2>
              {errors.length > 0 && <div className="error-message">{errors.map((error, index) => <p key={index}>{error}</p>)}</div>}
              <textarea
                placeholder="Leave your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <div className='review-modal-star'>{reviewStars()} Stars</div>
              <button
                type="submit"
                className="disabled-review-button"
                disabled={review.length < 10 || stars === 0}
              >
                Submit Your Review
              </button>
            </form>
          </div>
        </div>
      );
    }

export default CreateReviewModal
