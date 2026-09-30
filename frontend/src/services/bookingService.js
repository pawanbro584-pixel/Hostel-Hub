import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  getAllBookings: async () => {
    return await api.get('/bookings');
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  updateBooking: async (id, bookingData) => {
    return await api.put(`/bookings/${id}`, bookingData);
  },

  cancelBooking: async (id) => {
    return await api.put(`/bookings/${id}/cancel`);
  },

  approveBooking: async (id) => {
    return await api.put(`/bookings/${id}/approve`);
  },

  rejectBooking: async (id) => {
    return await api.put(`/bookings/${id}/reject`);
  },

  deleteBooking: async (id) => {
    return await api.delete(`/bookings/${id}`);
  }
};
