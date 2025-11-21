import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// TODO: Add interceptor to include token in headers
// WHY: Attach JWT token to every request automatically
// HINT: api.interceptors.request.use()

export default api;
