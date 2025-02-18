import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Loader2,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useLoginStore from "../../store/useLogin";
import loginImage from "../../assets/login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLoginStore();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");
    const success = await login(credentials);

    toast.dismiss(loadingToast);
    if (success) {
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } else {
      toast.error(error || "Failed to login. Please try again.");
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Remove Toaster component since it's in main.jsx */}

      {/* Left Section with Image and Text */}
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
              src={loginImage}
              alt="Student coding"
              className="w-full h-[300px] rounded-2xl shadow-2xl object-cover"
            />
          </div>

          {/* Mission Cards */}
          <div className="w-full max-w-lg space-y-6 pb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Welcome Back
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Continue Your Impact
                </h3>
                <p className="text-blue-600">
                  Support more students in their educational journey
                </p>
              </motion.div>

              <motion.div
                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <GraduationCap className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Track Progress
                </h3>
                <p className="text-blue-600">
                  Monitor the success of students you support
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Section with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6">
        {/* Mobile Heading - Only show on small screens */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-8 left-0 right-0 text-3xl font-bold text-blue-600 text-center lg:hidden"
        >
          Seat Adoption Portal
        </motion.h1>

        <motion.div
          className="w-full max-w-md"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-lg relative"
            whileHover={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 rounded-2xl" />
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <LogIn className="w-6 h-6 text-white" />
              </motion.div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center">
                Welcome Back
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Continue your journey in supporting technical education
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-4 w-4" />
                    <input
                      type="email"
                      required
                      className="pl-8 w-full py-2.5 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-4 w-4" />
                    <input
                      type="password"
                      required
                      className="pl-8 w-full py-2.5 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm mt-4"
                >
                  {loading ? (
                    <motion.div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Signing in...</span>
                    </motion.div>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Sign In</span>
                    </>
                  )}
                </motion.button>

                <motion.div
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center mt-4 space-x-1 text-sm"
                >
                  <span className="text-gray-600">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-700 inline-flex items-center"
                  >
                    Register here <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </motion.div>
              </form>

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
                      Signing you in...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
