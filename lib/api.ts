import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3010",
});

// 🔥 Interceptor global
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const unidadeId = localStorage.getItem("unidadeId");

  if (unidadeId) {
    config.headers["x-tenant-id"] = unidadeId;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Logout automático se token expirar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("unidadeId");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);