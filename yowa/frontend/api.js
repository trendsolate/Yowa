import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Conversations & messages
export const getConversations = () => api.get('/conversations').then(r => r.data);
export const createConversation = (data) => api.post('/conversations', data).then(r => r.data);
export const getMessages = (conversationId) =>
  api.get(`/conversations/${conversationId}/messages`).then(r => r.data);
export const sendMessage = (conversationId, data) =>
  api.post(`/conversations/${conversationId}/messages`, data).then(r => r.data);

// Habits
export const getHabits = (owner) => api.get('/habits', { params: { owner } }).then(r => r.data);
export const createHabit = (data) => api.post('/habits', data).then(r => r.data);
export const toggleHabitDay = (id, date) =>
  api.patch(`/habits/${id}/toggle`, { date }).then(r => r.data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);

// Todos
export const getTodos = (owner) => api.get('/todos', { params: { owner } }).then(r => r.data);
export const createTodo = (data) => api.post('/todos', data).then(r => r.data);
export const updateTodo = (id, data) => api.patch(`/todos/${id}`, data).then(r => r.data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);

export default api;