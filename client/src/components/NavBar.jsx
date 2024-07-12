import React from 'react';
import { Link, Outlet } from "react-router-dom";
import '../css/Navbar.css';

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  return (
    <div className='outlet'>
      <nav>
        <ul>
          <li><Link to="./login" onClick={handleLogout}>LogOut</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavBar;
