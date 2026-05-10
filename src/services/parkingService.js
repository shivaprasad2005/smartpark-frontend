import api from './api';

export const getParkingSlots = (userId, selectedTime) =>
  api.get('/parking/slots', { params: { userId, selectedTime } });