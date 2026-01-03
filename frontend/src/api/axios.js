import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // Default for Login/Signup
    }
});

export default api;