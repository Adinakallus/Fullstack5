import { useState } from 'react';
import { Link } from 'react-router-dom';

import UserInfo from '../components/UserInfo';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleShowUserInfo = (e) => {
    e.preventDefault();
    setShowUserInfo(true);
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <nav className="navbar">
          <ul>
            <li>
              <a href="#" onClick={handleShowUserInfo}>Info</a>
            </li>
            <li>
              <Link to={`/users/${user.id}/todos`} state={{ user }} >Todos</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/posts`}>Posts</Link>
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
              <h3>Welcome to your home page</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
