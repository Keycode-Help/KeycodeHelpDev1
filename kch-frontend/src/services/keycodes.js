import api from './request';

export const lookupByVin = (vin) => api.post('/api/v1/keycodes/lookup', { vin });
export const createRequest = (payload) => api.post('/api/v1/keycodes/requests', payload);
export const getMyRequests = () => api.get('/api/v1/keycodes/requests');
export const getAllRequests = () => api.get('/api/v1/keycodes/requests/all');
