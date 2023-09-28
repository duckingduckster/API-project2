import React, {useRef, useState, useEffect} from "react"
import { useDispatch } from "react-redux"
import { deletingReview } from "../../../store/review"

function DeleteReview ({isOpen, onClose, reviewId, onDelete}) {
    const dispatch = useDispatch()
    const modalRef = useRef()
    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
      setShowModal(isOpen)
    }, [isOpen])

    const handleDelete = async (e) => {
      e.preventDefault()
      const deletedReview = await dispatch(deletingReview(reviewId))
      if (deletedReview) {
        onDelete && onDelete()
        setShowModal(false)
      }
    }

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose && onClose()
          setShowModal(false)
        }
      };
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [onClose])

    return (
        <>
        {showModal && (
        <div className={`modal-overlay ${showModal ? "activeOverlay" : ""}`}>
          <div className="deleteModal" ref={modalRef}>
          <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review</p>
            <button className="deletebutton" onClick={handleDelete}>Yes (Delete Review)</button>
            <button className="cancelbutton" onClick={() => setShowModal(false)}>No (Keep Review)</button>
          </div>
        </div>
      )}
        </>
    )

}

export default DeleteReview
