import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://fieldsync.onrender.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});