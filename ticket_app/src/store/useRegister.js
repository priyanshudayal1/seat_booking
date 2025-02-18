import axios from 'axios';
import { create } from 'zustand';
import { API_URL } from '../lib/constants';

const useRegisterStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  register: async (userData) => {
    set({ loading: true, error: null, success: false });
    try {
      await axios.post(`${API_URL}/user/register`, {
        full_name: userData.fullName,
        designation: userData.designation,
        email: userData.email,
        phone_number: userData.phone,
        company_name: userData.company,
        password: userData.password
      });
      
      set({ loading: false, success: true });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        loading: false,
        success: false
      });
      return false;
    }
  },

  resetState: () => {
    set({ loading: false, error: null, success: false });
  }
}));

export default useRegisterStore;