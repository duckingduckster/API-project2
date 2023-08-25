import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSpots } from "../../../store/spots"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function SpotList () {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.spots)
    console.log(spots)
    const history = useHistory()

    useEffect(() =>{
        dispatch(getSpots())
    }, [dispatch])

    const spotClick = (spotId) =>{
        history.push(`/spots/${spotId}`)
    }

    return (
        <div>
        {spots.map((spot)=>{
            const avgRating = spot.avgRating !== undefined && spot.avgRating !== null ? Number(spot.avgRating).toFixed(1) : 'New'
            return (
                <div className='spotCard tooltip' key={spot.id} onClick={() => spotClick(spot.id)}>
              <div className='tooltip-spot' title={spot.name}></div>
              <div className='spot'>
                <div className='previewImg'>
                  <img className='spot-img' src={spot.previewImage || null} alt={`${spot.name}`} />
                </div>
                <div className='spot-container'>
                  <p className='location'>
                    {`${spot.city}, ${spot.state}`}<span className='stars'>★{avgRating || 'New'}</span>
                  </p>
                  <p className='spot-name' title={spot.name}>
                    <span className='tooltip-text'>{spot.name}</span>
                  </p>
                  <p className='price'>
                    <span className='spot-price'>${spot.price}</span> night
                  </p>
                </div>
              </div>
            </div>
            )
        })}

        </div>
    )

}

export default SpotList
