import { create } from "zustand";
import api from "../lib/api";

const usePayment = create((set) => ({
  loading: false,
  error: null,
  otpMethod: 'email', // Default to email
  setOtpMethod: (method) => set({ otpMethod: method }),
  generateAndDownloadPDF: async (userData, selectedCourses) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post("/user/generate-pdf", {
        userData,
        selectedCourses,
      }, { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        }
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `adoption_summary_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      set({ loading: false, error: error.message });
      return false;
    }
  },
}));

export default usePayment;