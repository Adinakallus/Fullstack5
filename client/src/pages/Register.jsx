import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetchHook';

const Register = () => {
  const nameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const fetchObj = useFetch();
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const handlePasswordChange = () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    setPasswordsMatch(password === confirmPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    await fetchObj.fetchData('users');

    if (!fetchObj.error) {
      const users = fetchObj.data;
      const userExists = users?.some((u) => u.username === name);

      if (userExists) {
        alert('UserName already exists');
      } else {
        const newUser = {
          id: (users.length + 1).toString(),
          name: "",
          username: name,
          email: `${name}@example.com`,
          address: {
            street: "",
            suite: "",
            city: "",
            zipcode: "",
            geo: {
              lat: "",
              lng: ""
            }
          },
          phone: "",
          website: password,
          company: {
            name: "",
            catchPhrase: "",
            bs: ""
          }
        };

        await fetchObj.fetchData('users', 'POST', newUser);

        if (!fetchObj.error) {
          localStorage.setItem('user', JSON.stringify(newUser));
          navigate('/home');
        }
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>UserName:</label>
          <input type="text" ref={nameRef} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref={passwordRef} onChange={handlePasswordChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" ref={confirmPasswordRef} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" disabled={!passwordsMatch}>Sign Up</button>
      </form>
      {!passwordsMatch && <p>Passwords do not match</p>}
    </div>
  );
};

export default Register;
