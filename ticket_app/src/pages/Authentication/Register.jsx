import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  UserCircle,
  Loader2,
  GraduationCap,
  Building2,
  Target,
  Sparkles,
} from "lucide-react";
import registerImage from "../../assets/register.jpg";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import useRegisterStore from "../../store/useRegister";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegisterStore();
  const [userData, setUserData] = useState({
    fullName: "",
    designation: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating your account...");
    const success = await register(userData);

    toast.dismiss(loadingToast);
    if (success) {
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } else {
      toast.error(error || "Registration failed. Please try again.");
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const formFields = [
    {
      icon: User,
      label: "Full Name",
      type: "text",
      key: "fullName",
      placeholder: "Enter your full name",
    },
    {
      icon: UserCircle,
      label: "Designation",
      type: "text",
      key: "designation",
      placeholder: "Enter your designation",
    },
    {
      icon: Briefcase,
      label: "Company Name",
      type: "text",
      key: "company",
      placeholder: "Enter your company name",
    },
    {
      icon: Mail,
      label: "Email Address",
      type: "email",
      key: "email",
      placeholder: "Enter your email",
    },
    {
      icon: Phone,
      label: "Phone Number",
      type: "tel",
      key: "phone",
      placeholder: "Enter phone number",
    },
    {
      icon: Lock,
      label: "Password",
      type: "password",
      key: "password",
      placeholder: "Create a password",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen overflow-hidden flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-50"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Left Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 flex-col h-full overflow-hidden bg-gradient-to-br from-blue-50/50 to-white/50"
      >
        {/* Portal Name */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-blue-600 p-8 text-center"
        >
          Seat Adoption Portal
        </motion.h1>

        <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
          {/* Main Image Container */}
          <div className="relative w-full max-w-lg">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              src={registerImage}
              alt="Students Learning"
              className="w-full h-[300px] rounded-2xl shadow-2xl object-cover"
            />
            {/* Stats Card */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-xl border-2 border-blue-100"
            >
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    50+ Partners
                  </span>
                  <span className="text-xs text-blue-600">
                    Making an Impact
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mission Cards - Now in a scrollable container */}
          <div className="w-full max-w-lg space-y-6 pb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Join Our Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <Target className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Enhance Technical Education
                </h3>
                <p className="text-blue-600">
                  Support future innovators in their journey
                </p>
              </motion.div>

              <motion.div
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Corporate Impact
                </h3>
                <p className="text-blue-600">
                  Drive meaningful change through education
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 h-full overflow-auto">
        {/* Mobile Heading - Only show on small screens */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-blue-600 text-center p-8 lg:hidden"
        >
          Seat Adoption Portal
        </motion.h1>

        <div className="min-h-full flex items-center justify-center p-4 lg:p-6">
          <motion.div
            className="w-full max-w-md"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg relative"
              whileHover={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 rounded-2xl" />
              <div className="relative">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <UserCircle className="w-6 h-6 text-white" />
                </motion.div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center">
                  Create Account
                </h1>
                <p className="text-center text-gray-600 mb-6">
                  Join our network of corporate partners making education
                  accessible
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.slice(0, 4).map((field, index) => (
                      <motion.div
                        key={field.key}
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <div className="relative group">
                          <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-4 w-4" />
                          <input
                            type={field.type}
                            required
                            className="pl-8 w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={field.placeholder}
                            value={userData[field.key]}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                [field.key]: e.target.value,
                              })
                            }
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Last two fields (Phone and Password) in full width */}
                  {formFields.slice(4).map((field, index) => (
                    <motion.div
                      key={field.key}
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: (index + 4) * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <div className="relative group">
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-4 w-4" />
                        <input
                          type={field.type}
                          required
                          className="pl-8 w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={field.placeholder}
                          value={userData[field.key]}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              [field.key]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full mt-4 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    {loading ? (
                      <motion.div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Creating Account...</span>
                      </motion.div>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <span className="text-gray-600">
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Login here
                    </Link>
                  </div>

                  {/* Loading Overlay */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium text-gray-600">
                          Processing your registration...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
