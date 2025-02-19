import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 border-b pb-4"
        >
          Available Courses
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[
            { name: "B.Tech", color: "red" },
            { name: "Diploma", color: "green" },
            { name: "ITI", color: "orange" },
          ].map((course) => {
            const colorConfig = {
              red: {
                bg: "bg-red-50",
                hover: "group-hover:bg-red-500",
                icon: "text-red-500",
                border: "hover:border-red-500",
                button: "text-red-600 hover:bg-red-500",
              },
              green: {
                bg: "bg-green-50",
                hover: "group-hover:bg-green-500",
                icon: "text-green-500",
                border: "hover:border-green-500",
                button: "text-green-600 hover:bg-green-500",
              },
              orange: {
                bg: "bg-orange-50",
                hover: "group-hover:bg-orange-500",
                icon: "text-orange-500",
                border: "hover:border-orange-500",
                button: "text-orange-600 hover:bg-orange-500",
              },
            }[course.color];

            return (
              <motion.div
                key={course.name}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className={`bg-white p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-100 group ${colorConfig.border} transition-all duration-300`}
              >
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 ${colorConfig.bg} rounded-xl flex items-center justify-center mb-4 ${colorConfig.hover} transition-colors duration-300`}
                  >
                    <GraduationCap
                      className={`h-6 w-6 ${colorConfig.icon} group-hover:text-white`}
                    />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-gray-800">
                    {course.name}
                  </h3>
                </div>
                <Link
                  to={`/select-region/${course.name}`}
                  className={`mt-2 bg-gray-50 ${colorConfig.button} px-6 py-3 rounded-xl hover:text-white w-full inline-block text-center transition-all duration-300 font-medium`}
                >
                  Select Branches
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;