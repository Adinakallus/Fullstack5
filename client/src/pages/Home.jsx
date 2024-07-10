import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import UserInfo from '../components/UserInfo';
import DisplayPosts from '../components/DisplayPosts';
import Posts from './Posts';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showUserPosts, setShowUserPosts]=useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleShowUserInfo = (e) => {
    e.preventDefault();
    setShowUserInfo(true);
    setShowUserPosts(false);

  };

  const handleShowUserPosts=(e)=>{
    e.preventDefault();
    setShowUserInfo(false);
    setShowUserPosts(true);
    console.log("handleShowUserPosts")
  }

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <nav className="navbar">
          <ul>
            <li>
              <a href="#" onClick={handleShowUserInfo}>Info</a>
            </li>
            <li>
              <a href="#" onClick={handleShowUserPosts} >Posts</a>
            </li>
            <li>
              <Link to={`/users/${user.id}/posts`}>Todos</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/albums`}>Albums</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          {showUserInfo ? (
            <UserInfo user={user} />
          ) : (
            <>
              <h2>Hello, {user.username}</h2>
              <h3>Welcome to your page</h3>
            </>
          )}
          {showUserPosts?(
            <Posts/>
          ): (
            <>
             
            </>
          )}
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
