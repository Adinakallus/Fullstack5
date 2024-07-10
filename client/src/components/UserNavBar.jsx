import React from 'react';
import { Link, Outlet } from "react-router-dom";

const UserNavBar = () => (
  <div>
    <nav>
      <ul>
        <li><Link to="./home">Home</Link></li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default UserNavBar;
