import React, { useRef, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { deleteSpotT } from "../../../store/spots"
import './deletespot.css'

const DeleteSpotModal = ({ spotId, isOpen, onClose, onDelete }) =>{
    const dispatch = useDispatch()
    const modalRef = useRef()
    const [openModal, setOpenModal] = useState(isOpen)

    const handleDelete = async () => {
      const deletedSpot = await dispatch(deleteSpotT(spotId))

      // if (deletedSpot) {
      //     setOpenModal(false);
      //     window.location.reload();
      // }
  }


    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose()
        }
      }
      })

    return (
        <div className={`delete-spot-container ${openModal ? "activeOverlay" : ""}`}>
        <div className="delete-spot-modal" ref={modalRef}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className="deleteButton" onClick={handleDelete}>
              Yes (Delete Spot)
            </button>
            <button className="cancelButton" onClick={() => setOpenModal(false)}>
              No (Keep Spot)
            </button>
        </div>
      </div>
    )
  }

export default DeleteSpotModal
