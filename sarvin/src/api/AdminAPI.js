import axios from './axios';

const API_URL = '/api/admin';

// Get dashboard stats
const getDashboardStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.get(`${API_URL}/dashboard`, config);
  return response.data;
};

// Get all users
const getUsers = async (token, { page = 1, limit = 10, search = '' }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { page, limit, search }
  };
  const response = await axios.get(API_URL, config); 
  return response.data;
};

const getUserOrders = async (token, userId, { page = 1, limit = 5 }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { page, limit }
  };
  const response = await axios.get(`${API_URL}/${userId}/orders`, config);
  return response.data;
};

export const adminAPI = {
  getDashboardStats,
  getUsers,
  getUserOrders
};