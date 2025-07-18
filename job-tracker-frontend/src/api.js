import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});


API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (userData) => API.post('/login', userData);


export const getJobs = (status = '') => API.get(`/jobs?status=${status}`);
export const addJob = (jobData) => API.post('/jobs', jobData);
export const updateJob = (id, jobData) => API.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const uploadResume = (id, formData) => API.post(`/jobs/upload-resume/${id}`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data', 
    },
});

export default API;