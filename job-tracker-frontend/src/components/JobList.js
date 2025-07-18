import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, deleteJob } from '../api';
import moment from 'moment'; // For easy date formatting

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filterStatus, setFilterStatus] = useState(''); // State for filter dropdown
    const [error, setError] = useState('');

    // Function to fetch jobs from the API
    const fetchJobs = async () => {
        setError(''); // Clear previous errors
        try {
            const res = await getJobs(filterStatus); // Pass filter status to API call
            setJobs(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch job applications.');
        }
    };

    // Fetch jobs on component mount and when filterStatus changes
    useEffect(() => {
        fetchJobs();
    }, [filterStatus]);

    // Handle job deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            try {
                await deleteJob(id);
                fetchJobs(); // Refresh the list after deletion
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to delete job application.');
            }
        }
    };

    return (
        <div className="job-list-container">
            <h2>My Job Applications</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="filter-controls">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {jobs.length === 0 ? (
                <p>No job applications found. Add one to get started!</p>
            ) : (
                <div className="job-cards-container">
                    {jobs.map((job) => (
                        <div key={job._id} className="job-card">
                            <h3>{job.company}</h3>
                            <p><strong>Role:</strong> {job.role}</p>
                            <p><strong>Current Status:</strong> {job.status}</p>
                            <p><strong>Applied On:</strong> {moment(job.applicationDate).format('MMM DD, YYYY')}</p>
                            {job.resumePath && (
                                <p>
                                    <a
                                        href={`http://localhost:5000/${job.resumePath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resume-link"
                                    >
                                        View Resume
                                    </a>
                                </p>
                            )}
                            <div className="job-actions">
                                <Link to={`/edit-job/${job._id}`} className="button edit-button">Edit</Link>
                                <Link to={`/job-timeline/${job._id}`} className="button timeline-button">Timeline</Link>
                                <button onClick={() => handleDelete(job._id)} className="button delete-button">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobList;