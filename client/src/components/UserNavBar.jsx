import React from 'react';
import { Link, Outlet } from "react-router-dom";
import '../css/Navbar.css';


const UserNavBar = () => (
  <div className='outlet'>
    <nav>
      <ul>
        <li><Link to="./home">Home</Link></li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default UserNavBar;
