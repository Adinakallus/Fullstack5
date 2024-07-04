import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch';

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
      await fetchObj.fetchData('users');
      
      if (!fetchObj.error) {
        const users = fetchObj.data;
        const user = users?.find((u) => u.username === name);

        if (user) {
          if (user.website == password) {
            localStorage.setItem('user', JSON.stringify(user)); 
            navigate('/home'); 
          }
        } 
        else 
          alert('UserName or password mismatch');
      }     
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>UserName:</label>
          <input type="text" ref={nameRef} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
