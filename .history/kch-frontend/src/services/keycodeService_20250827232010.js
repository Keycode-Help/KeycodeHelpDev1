import api from './request';

export const keycodeService = {
  /**
   * Get credentials for a specific OEM
   * @param {string} oem - The OEM identifier
   * @returns {Promise<Object>} - Promise resolving to credentials object
   */
  async getCredentials(oem) {
    try {
      const response = await api.post('/api/keycodes/creds', { oem });
      return response.data;
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  },

  /**
   * Get list of available portals
   * @returns {Promise<Object>} - Promise resolving to portals list
   */
  async getPortals() {
    try {
      const response = await api.get('/api/keycodes/portals');
      return response.data;
    } catch (error) {
      console.error('Error getting portals:', error);
      throw error;
    }
  }
};

export default keycodeService;
