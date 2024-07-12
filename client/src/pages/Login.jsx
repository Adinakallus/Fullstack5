import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import here

import useFetch from '../hooks/useFetchHook';

import '../css/login.css';

const Login = () => {
  const nameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const fetchObj = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    // Fetch the list of users from the server
    const users = await fetchObj.fetchData('users');
    const user = users?.find((u) => u.username === name);

    if (user) {
      if (user.website == password) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      }
    }
    else
      alert('UserName or password mismatch');
  };

  return (
    <div className='login-wrapper'>
    <div className="login-container">
      <h2>Login</h2>
      <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>UserName:</label>
          <input type="text" ref={nameRef} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <Link to={'/register'}>SignUp here</Link>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default Login;