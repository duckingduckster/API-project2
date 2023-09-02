import React, { useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams, } from 'react-router-dom'
import { updateSpotT, getUserSpots } from "../../../store/spots";

const UpdateSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector((state) => state.spots.spotDetail);
    const [errors, setErrors] = useState({})

    const [data, setData] = useState({
        country: spot?.country || "",
        address: spot?.address || "",
        city: spot?.city || "",
        state: spot?.state || "",
        description: spot?.description || "",
        lat: spot?.lat || "",
        lng: spot?.lng || "",
        name: spot?.name || "",
        price: spot?.price || "",
        previewImage: spot?.previewImage || ""
    });

    const { country, address, city, state, description, lat, lng, name, price, previewImage } = data

    useEffect(() => {
        if (spot) {
            setData({
                country: spot.country,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                description: spot.description,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                price: spot.price,
                previewImage: spot.previewImage
            });
        } else {
            dispatch(getUserSpots(spotId))
                .then(response => {
                    if (response) {
                        setData({
                            country: response.country,
                            address: response.address,
                            city: response.city,
                            state: response.state,
                            description: response.description,
                            lat: response.lat,
                            lng: response.lng,
                            name: response.name,
                            price: response.price,
                            previewImage: response.previewImage
                        });
                    }
                })
                .catch(err => console.error(err));
        }
    }, [dispatch, spotId, spot]);

    const validateForm = () => {
        const validationErrors = {};

        if(!country) {
            validationErrors.country = "Country is required"
        }
        if(!address) {
            validationErrors.address = "Street address is required"
        }
        if(!city) {
            validationErrors.city = "City is required"
        }
        if(!state) {
            validationErrors.state = "State is required"
        }
        // if(!lng) {
        //     errors.lng = "Lng is required"
        // }
        // if(!lat) {
        //     errors.lat = "Lat is requried"
        // }
        if(!description || description.length < 30) {
            validationErrors.description = "Description needs atleast 30 characters"
        }
        if(!name) {
            errors.name = "Name is required"
        }
        if(!price) {
            validationErrors.price = "Price is required"
        }
        if(!previewImage) {
            validationErrors.previewImage = "Preview Image is required"
        }

        setErrors(validationErrors); // update the state with the new errors
        return Object.keys(validationErrors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch(updateSpotT(spotId, data))
                .then(() => {
                    history.push(`/spots/${spotId}`);
                })
                .catch(errors => console.error(errors));
        }
    }

    const handleStringData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleNumberData = (e) => {
        setData({
            ...data,
            [e.target.name]: Number(e.target.value)
        });
    }

    return (
        <section className="create-spot-container">
        <h2>Create a New Spot!</h2>
        <p>Where is you place located?</p>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <form onSubmit={handleSubmit} className="create-spot-form">
            <div className="general-info">
            <input name="country" type="text" placeholder="country" value={country} onChange={handleStringData} />
                {errors.country && (
                    <p className='error-create'>{errors.country}</p>
                )}
                <div className="info">
                <input name="address" type="string" placeholder="address" value={address} onChange={handleStringData} />
                {errors.address && (
                    <p className='error-create'>{errors.address}</p>
                )}
                </div>
                <div className="info">
                <input name="city" type="string" placeholder="city" value={city} onChange={handleStringData} />
                {errors.city && (
                    <p className='error-create'>{errors.city}</p>
                )}
                </div>
                <div className="info">
                <input name="state" type="string" placeholder="STATE" value={state} onChange={handleStringData} />
                {errors.state && (
                    <p className='error-create'>{errors.state}</p>
                )}
                </div>
                <div className="info">
                <input name="lat" type="number" placeholder="Latitutde" min="-90" max="90" value={lat} onChange={handleNumberData} />
                {errors.lat && (
                    <p className='error-create'>{errors.lat}</p>
                )}
                </div>
                <div className="info">
                <input name="lng" type="number" placeholder="Longitude" min="-180" max="180" value={lng} onChange={handleNumberData} />
                {errors.lng && (
                    <p className='error-create'>{errors.lng}</p>
                )}
                </div>
                </div>
                <div className="description-container">
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special
                amenitites like fast wifi or parking, and what you love about the neighboorhood</p>
                <textarea name="description" className="description-textarea" type="string" placeholder="please write atleast 30 characters" value={description} onChange={handleStringData} />
                {errors.description && (
                    <p className='error-create'>{errors.description}</p>
                )}
                </div>
                <div className="name-container">
                <h2>Create a title for your spot</h2>
                <p>Catch guests' attention with a spot title that highlights what makes
                your place special.</p>
                <input name="name" type="string" placeholder="Name of your spot" value={name} onChange={handleStringData} />
                {errors.name && (
                    <p className='error-create'>{errors.name}</p>
                )}
                </div>
                <div className="price-container0">
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher
                    in search results.</p>
                <input name="price" type="number" placeholder="Price per Night (USD)" min="0" value={price} onChange={handleNumberData} />
                {errors.price && (
                    <p className='error-create'>{errors.price}</p>
                )}
                </div>
            <div className="images-container">
            <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input name="previewImage" type="string" placeholder="Preview Image Url" value={previewImage} onChange={handleStringData} />
                {errors.previewImage && (
                    <p className='error-create'>{errors.previewImage}</p>
                )}
                {/* <div >
                {urls?.map((url, index) => (
                    <div className="image-url" key={index}>
                        <input
                        name={`url${index}`}
                        type="string"
                        placeholder="Image Url"
                        value={url}
                        onChange={handleChange} // This handler needs to be adjusted to handle array updates.
                        />
                    </div>
                ))}
                </div> */}
                </div>
            <button type="submit" className="create-spot-btn" >Update your Spot</button>
        </form>
    </section>
    )
}

export default UpdateSpot
