import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import JobTimeline from './components/JobTimeline';
import './App.css'; 

function App() {
    
    const [token, setToken] = useState(localStorage.getItem('token'));

    
    const handleAuthSuccess = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <h1>Job Application Tracker</h1>
                    {token ? (
                        <div className="nav-links">
                            <Link to="/jobs">My Applications</Link>
                            <Link to="/add-job">Add Application</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="nav-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )}
                </nav>

                <div className="container">
                    <Routes>
                        {/* Public Routes for Auth */}
                        <Route
                            path="/login"
                            element={token ? <Navigate to="/jobs" /> : <Auth type="login" onAuthSuccess={handleAuthSuccess} />}
                        />
                        <Route
                            path="/register"
                            element={token ? <Navigate to="/jobs" /> : <Auth type="register" onAuthSuccess={handleAuthSuccess} />}
                        />

                        {/* Protected Routes (requires token) */}
                        <Route
                            path="/jobs"
                            element={token ? <JobList /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/add-job"
                            element={token ? <JobForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/edit-job/:id"
                            element={token ? <JobForm /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/job-timeline/:id"
                            element={token ? <JobTimeline /> : <Navigate to="/login" />}
                        />

                        {/* Redirect root to /jobs if logged in, else to /login */}
                        <Route path="/" element={token ? <Navigate to="/jobs" /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;