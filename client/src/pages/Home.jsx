import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserInfo from '../components/UserInfo';
import DisplayPosts from '../components/DisplayPosts';
import Posts from './Posts';
import '../css/HomePage.css';

const Home = () => {
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
        <div className="content">
          <h2>Hello, {user.username}</h2>
          <h3>Welcome to your page</h3>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <a href="#" onClick={handleShowUserInfo} className="nav-link">Info</a>
            </li>
            <li>
              <Link to={`/users/${user.id}/todos`} state={{ user }} className="nav-link">Todos</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/posts`} state={{ user }} className="nav-link">Posts</Link>
            </li>
            <li>
              <Link to={`/users/${user.id}/albums`} className="nav-link">Albums</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          {showUserInfo ? (
            <UserInfo user={user} />
          ) : null}
          {showUserPosts ? (
            <Posts />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;