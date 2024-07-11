import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetchHook';

const ShowAlbum = () => {
    const { id, aid } = useParams();
    const navigate = useNavigate();
    const hasRunRef = useRef(false);
    const fetchObj = useFetch();

    const [photos, setPhotos] = useState([]);
    const [totalPhotos, setTotalPhotos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [addPhotoForm, setAddPhotoForm] = useState({
        title: '',
        thumbnailUrl: '',
        url: '',
    });
    const [editPhotoForm, setEditPhotoForm] = useState({
        id: '',
        title: '',
        thumbnailUrl: '',
        url: '',
    });
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const titleRef = useRef(null);

    const handleFormFieldInput = (e, formSetter) => {
        const { name, value } = e.target;
        formSetter((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmitAddPhoto = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);

        const data = await fetchObj.fetchData('photos', 'POST', { ...addPhotoForm, albumId: id });

        if (data) {
            setPhotos((prevPhotos) => [...prevPhotos, data]);
            alert('The image has been added successfully!☑️');
            setAddPhotoForm({ title: '', thumbnailUrl: '', url: '' });
            setShowAddForm(false);
        }

        setButtonDisabled(false);
    };

    const handleSubmitEditPhoto = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);

        const updatedPhoto = await fetchObj.fetchData(`photos/${editPhotoForm.id}`, 'PUT', {
            albumId: id,
            id: editPhotoForm.id,
            title: editPhotoForm.title,
            url: editPhotoForm.url,
            thumbnailUrl: editPhotoForm.thumbnailUrl,
        });

        if (updatedPhoto) {
            setPhotos((prevPhotos) =>
                prevPhotos.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
            );
            alert('The image has been successfully updated!☑️');
            setShowEditForm(false);
        }

        setButtonDisabled(false);
    };

    const fetchTotalPhotos = useCallback(async () => {
        const photosList = await fetchObj.fetchData(`photos?albumId=${aid}`);
        if (photosList) {
            setTotalPhotos(photosList.length);
            setPhotos(photosList);
            setLoading(false);
        }
    }, [fetchObj, aid]);

    useEffect(() => {
        if (!hasRunRef.current) {
            fetchTotalPhotos();
            hasRunRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (showAddForm && titleRef.current) {
            titleRef.current.focus();
        }
    }, [showAddForm]);

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    const handleEdit = (photo) => {
        setEditPhotoForm({
            id: photo.id,
            title: photo.title,
            thumbnailUrl: photo.thumbnailUrl,
            url: photo.url,
        });
        setShowEditForm(true);
    };

    const handleDelete = async (photoId) => {
        setButtonDisabled(true);
        const response = await fetchObj.fetchData(`photos/${photoId}`, 'DELETE', '');
        if (response) {
            setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
            alert('The image has been successfully deleted!☑️');
            setCurrentPhotoIndex((prevIndex) => prevIndex % photos.length);
        }
        setButtonDisabled(false);
    };

    const handleBack = () => {
        navigate(`/users/${id}/albums`);
    };

    return (
        <div>
            <h2>Album {id} Photos</h2>
            <button onClick={() => setShowAddForm((prev) => !prev)} id="add-id" disabled={buttonDisabled}>
                + Add Photo
            </button>
            {showAddForm && (
                <form onSubmit={handleSubmitAddPhoto}>
                    <h3>Add Photo</h3>
                    <label>
                        <span>Title</span>
                        <input
                            name="title"
                            value={addPhotoForm.title}
                            onChange={(e) => handleFormFieldInput(e, setAddPhotoForm)}
                            required
                            type="text"
                            placeholder="Title"
                            ref={titleRef}
                            disabled={buttonDisabled}
                        />
                    </label>
                    <label>
                        <span>Thumbnail url</span>
                        <input
                            name="thumbnailUrl"
                            value={addPhotoForm.thumbnailUrl}
                            onChange={(e) => handleFormFieldInput(e, setAddPhotoForm)}
                            required
                            type="url"
                            placeholder="Thumbnail"
                            disabled={buttonDisabled}
                        />
                    </label>
                    <label>
                        <span>Url</span>
                        <input
                            name="url"
                            value={addPhotoForm.url}
                            onChange={(e) => handleFormFieldInput(e, setAddPhotoForm)}
                            required
                            type="url"
                            placeholder="Url"
                            disabled={buttonDisabled}
                        />
                    </label>
                    <button type="submit" disabled={buttonDisabled}>Add</button>
                </form>
            )}
            {showEditForm && (
                <form onSubmit={handleSubmitEditPhoto}>
                    <h3>Edit Photo</h3>
                    <label>
                        <span>Title</span>
                        <input
                            name="title"
                            value={editPhotoForm.title}
                            onChange={(e) => handleFormFieldInput(e, setEditPhotoForm)}
                            required
                            type="text"
                            placeholder="Title"
                            disabled={buttonDisabled}
                        />
                    </label>
                    <label>
                        <span>Thumbnail url</span>
                        <input
                            name="thumbnailUrl"
                            value={editPhotoForm.thumbnailUrl}
                            onChange={(e) => handleFormFieldInput(e, setEditPhotoForm)}
                            required
                            type="url"
                            placeholder="Thumbnail"
                            disabled={buttonDisabled}
                        />
                    </label>
                    <label>
                        <span>Url</span>
                        <input
                            name="url"
                            value={editPhotoForm.url}
                            onChange={(e) => handleFormFieldInput(e, setEditPhotoForm)}
                            required
                            type="url"
                            placeholder="Url"
                            disabled={buttonDisabled}
                        />
                    </label>
                    <button type="submit" disabled={buttonDisabled}>Update</button>
                </form>
            )}
            <button onClick={handleBack} id="back-id" disabled={buttonDisabled}>Back to Albums</button>
            {loading && <p>Loading...</p>}
            {!loading && photos.length > 0 && (
                <div className="photo-viewer">
                    <div className="image-item">
                        <img src={photos[currentPhotoIndex].thumbnailUrl} alt={photos[currentPhotoIndex].title} className="carousel-image" />
                        <p>{photos[currentPhotoIndex].title}</p>
                        <button onClick={() => handleEdit(photos[currentPhotoIndex])} className="edit-button" disabled={buttonDisabled}>
                            ✏️
                        </button>
                        <button onClick={() => handleDelete(photos[currentPhotoIndex].id)} className="delete-button" disabled={buttonDisabled}>
                            🗑️
                        </button>
                    </div>
                    <button onClick={handlePrevPhoto} disabled={photos.length <= 1 || buttonDisabled} className="nav-button">Previous</button>
                    <button onClick={handleNextPhoto} disabled={photos.length <= 1 || buttonDisabled} className="nav-button">Next</button>
                </div>
            )}
        </div>
    );
};

export default ShowAlbum;
