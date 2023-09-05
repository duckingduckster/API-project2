import React, { useState, useEffect} from "react"
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom'
import { createSpotT, createImageT } from "../../../store/spots";

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const initialState = {
        country: "",
        address: "",
        city: "",
        state: "",
        description: "",
        name: "",
        price: "",
        previewImage: "",
        lat: 0,
        lng: 0,
        urls: ["", "", "", ""],
        errors: {},
        validSubmit: false,
    };

    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("url")) {
            const index = parseInt(name.slice(3));
            setFormData((prevData) => ({
                ...prevData,
                urls: prevData.urls.map((url, i) => (i === index ? value : url))
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    const { country, address, city, state, lat, lng, description, name, price, previewImage, urls, errors, validSubmit } = formData

    const validateForm = () => {
        const errors = {};
        if(!country) {
            errors.country = "Country is required"
        }
        if(!address) {
            errors.address = "Street address is required"
        }
        if(!city) {
            errors.city = "City is required"
        }
        if(!state) {
            errors.state = "State is required"
        }
        // if(!lng) {
        //     errors.lng = "Lng is required"
        // }
        // if(!lat) {
        //     errors.lat = "Lat is requried"
        // }
        if(!description || description.length < 30) {
            errors.description = "Description needs atleast 30 characters"
        }
        if(!name) {
            errors.name = "Name is required"
        }
        if(!price) {
            errors.price = "Price is required"
        }
        if(!previewImage) {
            errors.previewImage = "Preview Image is required"
        }
        urls.forEach((url, index) => {
            if(url && !(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))) {
                errors[`url${index}`] = "Image url must end in .png, .jpg, or .jpeg";
            }
        })
        setFormData({ ...formData, errors });
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setFormData({ ...formData, validSubmit: true })
            const spotDetails = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
            }

            try {
                const createdSpot = await dispatch(createSpotT(spotDetails))
            if(createdSpot) {
            await dispatch(
              createImageT(createdSpot.id, {preview: true, url: previewImage})
            );
            urls?.forEach(async (url) => {
              if (url) {
                await dispatch(createImageT(createdSpot.id, {preview: false, url: url}));
                    }
                })
            }
            history.push(`/spots/${createdSpot.id}`);
            } catch (err) {
                console.error("Spot creation failed:", err);
            }

            setFormData({ ...formData, validSubmit: false });
        }
    };


    useEffect(() => {
        setFormData(initialState);
        }, [history.location])

    return (
        <section className="create-spot-container">
        <h2>Create a New Spot!</h2>
        <p>Where is you place located?</p>
        <p>Guests will only get your exact address once they booked a reservation</p>
        <form onSubmit={handleSubmit} className="create-spot-form">
            <div className="general-info">
            <input name="country" type="text" placeholder="country" value={country} onChange={handleChange} />
                {errors.country && (
                    <p className='error-create'>{errors.country}</p>
                )}
                <div className="info">
                <input name="address" type="string" placeholder="address" value={address} onChange={handleChange} />
                {errors.address && (
                    <p className='error-create'>{errors.address}</p>
                )}
                </div>
                <div className="info">
                <input name="city" type="string" placeholder="city" value={city} onChange={handleChange} />
                {errors.city && (
                    <p className='error-create'>{errors.city}</p>
                )}
                </div>
                <div className="info">
                <input name="state" type="string" placeholder="STATE" value={state} onChange={handleChange} />
                {errors.state && (
                    <p className='error-create'>{errors.state}</p>
                )}
                </div>
                <div className="info">
                <input name="lat" type="number" placeholder="Latitutde" min="-90" max="90" value={lat} onChange={handleChange} />
                {errors.lat && (
                    <p className='error-create'>{errors.lat}</p>
                )}
                </div>
                <div className="info">
                <input name="lng" type="number" placeholder="Longitude" min="-180" max="180" value={lng} onChange={handleChange} />
                {errors.lng && (
                    <p className='error-create'>{errors.lng}</p>
                )}
                </div>
                </div>
                <div className="description-container">
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special
                amenitites like fast wifi or parking, and what you love about the neighboorhood</p>
                <textarea name="description" className="description-textarea" type="string" placeholder="please write atleast 30 characters" value={description} onChange={handleChange} />
                {errors.description && (
                    <p className='error-create'>{errors.description}</p>
                )}

                </div>
                <div className="name-container">
                <h2>Create a title for your spot</h2>
                <p>Catch guests' attention with a spot title that highlights what makes
                your place special.</p>
                <input name="name" type="string" placeholder="Name of your spot" value={name} onChange={handleChange} />
                {errors.name && (
                    <p className='error-create'>{errors.name}</p>
                )}
                </div>
                <div className="price-container0">
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher
                    in search results.</p>
                <input name="price" type="number" placeholder="Price per Night (USD)" min="0" value={price} onChange={handleChange} />
                {errors.price && (
                    <p className='error-create'>{errors.price}</p>
                )}
                </div>
            <div className="images-container">
            <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input name="previewImage" type="string" placeholder="Preview Image Url" value={previewImage} onChange={handleChange} />
                {errors.previewImage && (
                    <p className='error-create'>{errors.previewImage}</p>
                )}
                <div >
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
                </div>
                </div>
            <button type="submit" className="create-spot-btn" disabled={validSubmit}>Create Spot</button>
        </form>
    </section>
    )
}

export default CreateSpot
