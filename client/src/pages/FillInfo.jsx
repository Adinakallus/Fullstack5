import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetchHook';

import '../css/completeProfile.css';

const FillInfo = () => {
    const navigate = useNavigate();
    const fetchObj = useFetch();

    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const streetRef = useRef();
    const suiteRef = useRef();
    const cityRef = useRef();
    const zipcodeRef = useRef();
    const latRef = useRef();
    const lngRef = useRef();
    const companyNameRef = useRef();
    const catchPhraseRef = useRef();
    const bsRef = useRef();

    const handleInfo = async (e) => {
        e.preventDefault();
        console.log('info');
        const newUser = JSON.parse(localStorage.getItem('user'));

        const updatedUser = {
            ...newUser,
            name: nameRef.current.value,
            email: emailRef.current.value,
            address: {
                street: streetRef.current.value,
                suite: suiteRef.current.value,
                city: cityRef.current.value,
                zipcode: zipcodeRef.current.value,
                geo: {
                    lat: latRef.current.value,
                    lng: lngRef.current.value,
                },
            },
            phone: phoneRef.current.value,
            company: {
                name: companyNameRef.current.value,
                catchPhrase: catchPhraseRef.current.value,
                bs: bsRef.current.value,
            },
        };

            await fetchObj.fetchData(`users/${newUser.id}`, 'PUT', updatedUser);

            if (!fetchObj.error){
                localStorage.setItem('user', JSON.stringify(updatedUser));
                localStorage.removeItem('newUser');
                navigate('/home');
            }
    };

    return (
        <div className="container">
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleInfo} className="complete-profile-form">
                <div className="form-section">
                    <fieldset>
                        <legend>Personal Information</legend>
                        <input
                            type="text"
                            placeholder="Full Name"
                            ref={nameRef}
                            required />
                        <input
                            type="email"
                            placeholder="Email"
                            ref={emailRef}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            ref={phoneRef}
                            required />
                    </fieldset>
                </div>
                <div className="form-section">
                    <fieldset>
                        <legend>Address Information</legend>
                        <input
                            type="text"
                            placeholder="Street"
                            ref={streetRef}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Suite"
                            ref={suiteRef}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            ref={cityRef}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Zipcode"
                            ref={zipcodeRef}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Latitude"
                            ref={latRef}
                            required                        />
                        <input
                            type="text"
                            placeholder="Longitude"
                            ref={lngRef}
                            required                        />
                    </fieldset>
                </div>
                <div className="form-section">
                    <fieldset>
                        <legend>Company Information</legend>
                        <input
                            type="text"
                            placeholder="Company Name"
                            ref={companyNameRef}
                            required                        />
                        <input
                            type="text"
                            placeholder="Catch Phrase"
                            ref={catchPhraseRef}
                            required                        />
                        <input
                            type="text"
                            placeholder="Business Strategy"
                            ref={bsRef}
                            required                        />
                    </fieldset>
                </div>
                <div className="button-container">
                    <button type="submit" className="submit-button">Complete Profile</button>
                </div>
            </form>
        </div>
    );
};

export default FillInfo;
