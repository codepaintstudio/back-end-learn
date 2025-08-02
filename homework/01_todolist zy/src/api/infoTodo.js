

import { instance } from '../utils/request';

export const fetchTodos = async () => {
  try {
    const response = await instance.get('/api/todos');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch todos');
  }
};

export const addTodo = async (text) => {
  try {
    const response = await instance.post('/api/todos', { text });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add todo');
  }
};

export const updateTodo = async (id, updates) => {
  try {
    const response = await instance.put(`/api/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update todo');
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await instance.delete(`/api/todos/${id}`);
    return response.data || null;
  } catch (error) {
    throw new Error('Failed to delete todo');
  }
};