import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api';

const Auth = ({ type, onAuthSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            let res;
            if (type === 'register') {
                res = await registerUser({ username, password });
            } else {
                res = await loginUser({ username, password });
            }
            onAuthSuccess(res.data.token); 
            navigate('/jobs'); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
            </form>
        </div>
    );
};

export default Auth;