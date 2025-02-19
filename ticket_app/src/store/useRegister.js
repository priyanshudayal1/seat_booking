import axios from 'axios';
import { create } from 'zustand';
import { API_URL } from '../lib/constants';

const useRegisterStore = create((set) => ({
  loading: false,
  error: null,
  success: false,
  otpSent: false,
  otpVerified: false,
  userDetails: null,

  setUserDetails: (details) => {
    set({ userDetails: details });
  },

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

  sendOTP: async (email) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/user/generate-otp`, { email });
      set({ loading: false, otpSent: true });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to send OTP',
        loading: false
      });
      return false;
    }
  },

  verifyOTP: async (otp) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/user/verify-otp`, { 
        otp,
        email: useRegisterStore.getState().userDetails?.email
      });
      set({ loading: false, otpVerified: true });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to verify OTP',
        loading: false
      });
      return false;
    }
  },

  resetState: () => {
    set({ 
      loading: false, 
      error: null, 
      success: false,
      otpSent: false,
      otpVerified: false,
      userDetails: null
    });
  }
}));

export default useRegisterStore;