import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../lib/constants";
import useLoginStore from "./useLogin";

const useDashboard = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const userId = useLoginStore.getState().userId;
      const response = await axios.get(
        `${API_URL}/user/profile/${userId}`
      );
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const userId = useLoginStore.getState().userId;
      const response = await axios.put(
        `${API_URL}/user/profile/update/${userId}`,
        profileData
      );
      set({ profile: response.data, isLoading: false });
      await useDashboard.getState().fetchProfile();
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update profile",
        isLoading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },
}));

export default useDashboard;
