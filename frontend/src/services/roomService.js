import api from './api';

export const roomService = {
  getAllRooms: async (params = {}) => {
    return await api.get('/rooms', { params });
  },

  getRoomById: async (id) => {
    return await api.get(`/rooms/${id}`);
  },

  createRoom: async (formData) => {
    return await api.post('/rooms', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updateRoom: async (id, formData) => {
    return await api.put(`/rooms/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteRoom: async (id) => {
    return await api.delete(`/rooms/${id}`);
  }
};
