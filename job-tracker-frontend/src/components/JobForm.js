import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addJob, updateJob, getJobs, uploadResume } from '../api';

const JobForm = () => {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied'); 
    const [resume, setResume] = useState(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); 

    
    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                try {
                    
                    const res = await getJobs();
                    const jobToEdit = res.data.find(job => job._id === id);
                    if (jobToEdit) {
                        setCompany(jobToEdit.company);
                        setRole(jobToEdit.role);
                        setStatus(jobToEdit.status);
                        
                    } else {
                        setError('Job not found.');
                    }
                } catch (err) {
                    setError(err.response?.data?.msg || 'Failed to fetch job details.');
                }
            };
            fetchJob();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            let jobRes;
            const jobData = { company, role, status };

            if (id) {
                jobRes = await updateJob(id, jobData);
            } else {
                jobRes = await addJob(jobData);
            }

            
            if (resume) {
                const formData = new FormData();
                formData.append('resume', resume);
                await uploadResume(id || jobRes.data._id, formData); 
            }

            navigate('/jobs'); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to save job application. Please check your inputs.');
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]); 
    };

    return (
        <div className="job-form-container">
            <h2>{id ? 'Edit Job Application' : 'Add New Job Application'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="company">Company:</label>
                    <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="resume">Resume (Optional):</label>
                    <input
                        type="file"
                        id="resume"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">{id ? 'Update Application' : 'Add Application'}</button>
            </form>
        </div>
    );
};

export default JobForm;