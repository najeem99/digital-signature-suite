import axios from "axios";
import { useAuthStore } from "../store/authStore";
 
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "NO-URL",
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const { user } = useAuthStore.getState(); // ✅ get state without hook
        const token = user?.token || null;

        if (
            config.url &&
            !config.url.includes("/login") &&
            !config.url.includes("/register")
        ) {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuthStore.getState();
            logout(); // Clear store + localStorage

            // Optional: Redirect to login
            window.location.href = "/login"; 
            // or useNavigate in components
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
