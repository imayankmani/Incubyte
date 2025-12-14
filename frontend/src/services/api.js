import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Sweets API
export const getAllSweets = () => api.get('/sweets');
export const searchSweets = (params) => api.get('/sweets/search', { params });
export const createSweet = (data) => api.post('/sweets', data);
export const updateSweet = (id, data) => api.put(`/sweets/${id}`, data);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);
export const purchaseSweet = (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity });
export const restockSweet = (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity });

export default api;