import axios from "axios";

// In dev, use Vite proxy when backend is localhost:3000
const resolveBaseURL = () => {
  const envUrl =
    import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "";

  if (
    import.meta.env.DEV &&
    envUrl === "http://localhost:3000"
  ) {
    return "";
  }

  return envUrl;
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,
  timeout: 120000,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Add Bearer token automatically
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

// Process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle token expiry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/register") &&
      !originalRequest.url?.includes("/refresh")
    ) {
      // If refresh already running
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        const { data } = await api.post(
          "/api/users/refresh",
          refreshToken ? { refreshToken } : {}
        );

        // Save new tokens
        if (data.token) {
          localStorage.setItem("token", data.token);

          if (data.refreshToken) {
            localStorage.setItem(
              "refreshToken",
              data.refreshToken
            );
          }

          // Update default header
          api.defaults.headers.common.Authorization =
            `Bearer ${data.token}`;

          processQueue(null, data.token);

          // Retry original request
          originalRequest.headers.Authorization =
            `Bearer ${data.token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;