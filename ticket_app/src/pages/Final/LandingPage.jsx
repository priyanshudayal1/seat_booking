import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Users, BookOpen, Lock, Wrench, School } from "lucide-react";

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
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Global Investor Summit</span>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Contact Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Empower the Future:
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Adopt a Student
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              To adopt a student is to embrace their journey, foster their talents, and ignite their dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Existing Course Cards Section */}
      <section className="p-4 lg:p-6">
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
              { name: "B.Tech", color: "red", icon: BookOpen },
              { name: "Diploma", color: "green", icon: School },
              { name: "ITI", color: "orange", icon: Wrench },
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
                      {React.createElement(course.icon, {
                        className: `h-6 w-6 ${colorConfig.icon} group-hover:text-white`
                      })}
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
      </section>

      {/* Investment Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Investment Guide</h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: '1. Select the Course',
                description: 'Choose from B.Tech, ITI, or Diploma programs',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: '2. Choose a Region',
                description: 'Select your preferred location (e.g., Jabalpur)',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: '3. Pick the Number of Seats & Branch',
                description: 'Specify seats and choose specialization (e.g., CSE/AI)',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: '5. Lock in for Confirmation',
                description: 'Confirm your investment choices',
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start mb-12 group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in shaping the future of education in Madhya Pradesh. Your investment can change lives.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Investing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center mb-8">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-center">
            © 2025 Global Investor Summit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
