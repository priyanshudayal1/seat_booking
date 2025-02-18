import { motion } from "framer-motion";
import {
  ChevronRight,
  GraduationCap,
  Users,
  Building2,
  TrendingUp,
  Globe,
  Zap,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import homeImage from '../assets/home.jpg';

const Home = () => {
  const features = [
    {
      icon: <GraduationCap size={24} />,
      title: "Support Education",
      description: "Help students achieve their dreams through seat adoption",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: <Users size={24} />,
      title: "CSR Impact",
      description: "Make a meaningful difference in society through education",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: <Building2 size={24} />,
      title: "Corporate Benefits",
      description: "Enhance your company's social responsibility profile",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Student Growth",
      description: "Track the progress and success of supported students",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      description: "Support students from diverse backgrounds worldwide",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: <Zap size={24} />,
      title: "Innovative Platform",
      description:
        "Leverage cutting-edge technology for seamless seat adoption",
      gradient: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-100/40 to-blue-50/40" />
        <div className="absolute w-96 h-96 blur-[120px] rounded-full -top-10 -left-10 bg-blue-100/30" />
        <div className="absolute w-96 h-96 blur-[120px] rounded-full top-1/2 right-0 bg-blue-100/30" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-blue-600" size={24} />
            <span className="text-blue-600 font-medium">
              Welcome to the Future of Education
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Seat Adoption Portal
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empower the future through education. Join our innovative platform
            to make a lasting impact on students&apos; lives.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-200/50"
              >
                Get Started <ChevronRight size={20} />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-blue-600 border border-blue-100 rounded-xl font-semibold shadow-lg hover:bg-blue-50/50 transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-full max-w-3xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-transparent" />
            <img
              src={homeImage}
              alt="Education Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-blue-100 hover:border-blue-200 transition-all shadow-lg"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          className="mt-32 bg-white/80 backdrop-blur-lg rounded-2xl border border-blue-100 p-8 shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                value: "1000+",
                label: "Students Supported",
                gradient: "from-blue-600 to-blue-800",
              },
              {
                value: "50+",
                label: "Corporate Partners",
                gradient: "from-blue-700 to-blue-900",
              },
              {
                value: "95%",
                label: "Success Rate",
                gradient: "from-blue-600 to-blue-800",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div
                  className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Ready to Make a Difference?
          </h2>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-200/50"
            >
              Start Your Journey Today
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
