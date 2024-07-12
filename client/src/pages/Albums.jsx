import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetchHook';
import '../css/Albums.css'
const Albums = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

  const fetchObj = useFetch();

  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);

    const data = await fetchObj.fetchData('albums');
    if (data) {
      const userAlbums = data.filter(album => album.userId === Number(id));
      setAlbums(userAlbums);
      setFilteredAlbums(userAlbums);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!hasRunRef.current) {
      fetchAlbums();
      hasRunRef.current = true;
    }    
  }, []);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    filterAlbums(value);
  };

  const filterAlbums = (query) => {
    const filtered = albums.filter(album =>
      album.title?.toLowerCase().includes(query.toLowerCase()) || album.id.toString().includes(query)
    );
    setFilteredAlbums(filtered);
  };

  const handleClick = (albumId) => {
    navigate(`/users/${id}/albums/${albumId}`);
  };

  const handleAdd = async () => {
    const title = prompt("Please enter the title of the Album:");
    if (!title) {
      alert("Error! You must enter a value ❌");
      return;
    }

    const response = await fetchObj.fetchData('albums');
    if (response) {
      const newId = Math.max(...data.map(album => Number(album.id))) + 1; // Generate a new unique id

      const newAlbum = {
        userId: Number(id),
        id: newId,
        title
      };

      const postResponse = await fetchObj.fetchData('albums', 'POST', newAlbum);

      if (postResponse) {
        const data = await postResponse.json();
        const updatedAlbums = [...albums, data];
        setAlbums(updatedAlbums);
        setFilteredAlbums(updatedAlbums);
        alert('The Album has been added successfully! ☑️');
      }
    }
  }

  return (
    <div className="albums-container">
      <div className="albums-header">
          <h2>User {id}'s Albums</h2>
      <button onClick={handleAdd} id="addA-id">+ Add Album</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="item-container">
        {loading ? (
          <p>Loading...</p>
        )  : (
          filteredAlbums.map((album) => (
            <div key={album.id} className="card" onClick={() => handleClick(album.id)}>
              <h3>{album.title}</h3>
              <p>Serial Number: {album.id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Albums;
