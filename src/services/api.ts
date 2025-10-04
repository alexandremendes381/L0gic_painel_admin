import axios, { AxiosRequestConfig } from "axios";

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função para pegar o token do localStorage
const getToken = () => localStorage.getItem("token") || "";

// Função helper para incluir headers
const withAuth = (config: AxiosRequestConfig = {}) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(config.headers || {}),
    },
  };
};

const API = {
  get: async (endpoint: string, config = {}) => {
    return axios.get(`${API_URL}${endpoint}`, withAuth(config));
  },
  post: async (endpoint: string, data: unknown, config = {}) => {
    return axios.post(`${API_URL}${endpoint}`, data, withAuth(config));
  },
  put: async (endpoint: string, data: unknown, config = {}) => {
    return axios.put(`${API_URL}${endpoint}`, data, withAuth(config));
  },
  delete: async (endpoint: string, config = {}) => {
    return axios.delete(`${API_URL}${endpoint}`, withAuth(config));
  },
};

export default API;