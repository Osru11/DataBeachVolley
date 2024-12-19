import axios from 'axios';
import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/"; 

// Login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}api/login/`, { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await axiosInstance.post(`${API_URL}api/logout/`, {});
  } catch (error) {
    console.error("Error during logout:", error.response?.data || error.message);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = async () => {

  try {
    const response = await axios.get(`${API_URL}api/comprobar-usuario/`);
    if(response.data.authenticated){
      try {
        const response = await axiosInstance.get(`${API_URL}api/user/`);
        return response.data; // Retorna datos si está autenticado
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.warn("No authenticated user found."); // Muestra un mensaje si no está autenticado
          return null; // Retorna null si no hay usuario
        }
        console.error("Error fetching current user:", error.response?.data || error.message);
        throw error; // Lanza otros errores inesperados
      }
    }else{
      return null;
    }
  } catch (error) {
    throw error;
  }
};


// Register
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}api/register/`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};


//GetUser
export const getUser = async () => {

  try {
    const response = await axios.get(`${API_URL}api/user/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};