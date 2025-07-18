import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobs } from '../api';
import moment from 'moment';

const JobTimeline = () => {
    const { id } = useParams(); 
    const [job, setJob] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            setError(''); 
            try {
                
                const res = await getJobs();
                const selectedJob = res.data.find(j => j._id === id);
                if (selectedJob) {
                    setJob(selectedJob);
                } else {
                    setError('Job not found or unauthorized access.');
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to fetch job timeline.');
            }
        };
        fetchJobDetails();
    }, [id]); 

    if (error) return <p className="error-message">{error}</p>;
    if (!job) return <p>Loading timeline...</p>; 

    return (
        <div className="job-timeline-container">
            <h2>Timeline for: {job.company} - {job.role}</h2>
            <div className="timeline">
                {job.statusHistory.length === 0 ? (
                    <p>No status history available for this job.</p>
                ) : (
                    <ul>
                        {job.statusHistory
                            .sort((a, b) => new Date(a.date) - new Date(b.date)) 
                            .map((history, index) => (
                                <li key={index}>
                                    <div className="timeline-date">
                                        {moment(history.date).format('MMM DD, YYYY - hh:mm A')}
                                    </div>
                                    <div className="timeline-status">
                                        Status changed to: <strong>{history.status}</strong>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default JobTimeline;