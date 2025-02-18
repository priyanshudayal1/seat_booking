import { useEffect, useState } from "react";
import useDashboard from "../../store/useDashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Building2,
  PenSquare,
  X,
  Shield,
  CircuitBoard,
  Fingerprint,
  ChevronRight,
  UserCircle2,
} from "lucide-react";

const Profile = () => {
  const { profile, fetchProfile, updateProfile, isLoading } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    designation: "",
    email: "",
    phone_number: "",
    company_name: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        designation: profile.designation || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        company_name: profile.company_name || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage("Profile updated successfully!");
      setIsModalOpen(false);
    } else {
      setMessage(result.error || "Failed to update profile");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative flex flex-col min-h-[calc(100vh-64px)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-48 lg:w-72 h-48 lg:h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 left-10 w-48 lg:w-72 h-48 lg:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 lg:mb-4 p-2.5 lg:p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 text-blue-700 rounded-xl shadow-lg text-sm"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
            {message}
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 lg:mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <UserCircle2 className="w-7 h-7 lg:w-10 lg:h-10 text-blue-500" />
              Profile Settings
            </h1>
            <p className="text-sm lg:text-base text-gray-500 flex items-center gap-2">
              <CircuitBoard className="w-4 h-4" />
              Manage your personal information and preferences
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
          >
            <PenSquare size={20} /> Edit Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 flex-1 overflow-hidden w-full"
      >
        <div className="p-2 sm:p-3 lg:p-8">
          <div className="grid gap-2 sm:gap-2.5 lg:gap-6 md:grid-cols-2 max-w-full">
            <div className="flex items-center gap-2 lg:gap-4 p-2.5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all group cursor-default w-full">
              <div className="p-2.5 lg:p-4 bg-blue-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <User className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] lg:text-sm text-gray-500 mb-0.5">
                  Full Name
                </p>
                <p className="text-sm lg:text-xl font-medium text-gray-800 truncate pr-2">
                  {profile?.full_name}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4 p-2.5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all group cursor-default w-full">
              <div className="p-2.5 lg:p-4 bg-purple-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Briefcase className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] lg:text-sm text-gray-500 mb-0.5">
                  Designation
                </p>
                <p className="text-sm lg:text-xl font-medium text-gray-800 truncate pr-2">
                  {profile?.designation}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4 p-2.5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all group cursor-default w-full">
              <div className="p-2.5 lg:p-4 bg-green-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Mail className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] lg:text-sm text-gray-500 mb-0.5">
                  Email
                </p>
                <p className="text-sm lg:text-xl font-medium text-gray-800 truncate pr-2">
                  {profile?.email}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4 p-2.5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all group cursor-default w-full">
              <div className="p-2.5 lg:p-4 bg-orange-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] lg:text-sm text-gray-500 mb-0.5">
                  Phone Number
                </p>
                <p className="text-sm lg:text-xl font-medium text-gray-800 truncate pr-2">
                  {profile?.phone_number}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4 p-2.5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl hover:shadow-lg transition-all group cursor-default md:col-span-2 w-full">
              <div className="p-2.5 lg:p-4 bg-indigo-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Building2 className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] lg:text-sm text-gray-500 mb-0.5">
                  Company Name
                </p>
                <p className="text-sm lg:text-xl font-medium text-gray-800 truncate pr-2">
                  {profile?.company_name}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 opacity-0 group-hover:opacity-30 transition-opacity flex-shrink-0" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-start sm:items-center justify-center pointer-events-none p-4 z-50 overflow-y-auto"
            >
              <div className="bg-white rounded-2xl p-4 lg:p-6 w-full max-w-xl pointer-events-auto shadow-2xl border border-gray-100 mx-auto my-4 sm:my-8">
                <div className="flex justify-between items-start mb-4 lg:mb-6">
                  <div>
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                      Edit Profile
                    </h2>
                    <p className="text-[11px] lg:text-sm text-gray-500 mt-0.5">
                      Update your personal information
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                  <div>
                    <label className="block mb-1 text-xs lg:text-sm text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full p-2 lg:p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs lg:text-sm text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full p-2 lg:p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs lg:text-sm text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full p-2 lg:p-2.5 text-sm border rounded-lg bg-gray-50"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs lg:text-sm text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full p-2 lg:p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs lg:text-sm text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full p-2 lg:p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 lg:p-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
