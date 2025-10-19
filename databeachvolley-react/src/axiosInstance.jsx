import axios from 'axios';
import Cookies from 'js-cookie';
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true, // Importante para enviar cookies
});

axiosInstance.interceptors.request.use((config) => {
    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export default axiosInstance;