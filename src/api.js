import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

let isAlreadyRedirecting = false;


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && !isAlreadyRedirecting) {
            isAlreadyRedirecting = true;
            console.log("Unauthorized error detected. Showing alert and redirecting...");
            alert("Session expired. Redirecting to login...");
            localStorage.clear();
            window.location.href = "/login"; 
        }
        return Promise.reject(error);
    }
);

export default api;
