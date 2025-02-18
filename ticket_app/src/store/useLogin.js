import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../lib/constants';
import { persist } from 'zustand/middleware';

const useLoginStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      loading: false,
      error: null,
      user: null,
      userId: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/user/login`, credentials);
          const { user } = response.data;
          set({ isLoggedIn: true, user, userId: user.id, loading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to login',
            loading: false,
            isLoggedIn: false
          });
          return false;
        }
      },

      logout: () => {
        set({ isLoggedIn: false, user: null, userId: null });
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        user: state.user,
        userId: state.userId
      })
    }
  )
);

export default useLoginStore;