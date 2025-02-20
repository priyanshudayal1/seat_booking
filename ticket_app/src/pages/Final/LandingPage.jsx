import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  GraduationCap,
  MapPin,
  Users,
  BookOpen,
  Lock,
  Wrench,
  School,
  ArrowRight,
  Globe,
} from "lucide-react";
import landingImage from "../../assets/landing.jpg";

const LandingPage = () => {
  const coursesRef = useRef(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

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

  const navbarVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const scrollToCourses = () => {
    toast.success("Please select a course to invest", {
      icon: "🎓",
      duration: 3000,
    });

    coursesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-lg"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Global Investor Summit
            </span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative pt-32 pb-20 px-4 overflow-hidden"
      >
        <div className="container mx-auto text-center max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-7xl font-bold text-gray-900 leading-tight">
              Empower the Future:
              <motion.span
                initial={{ backgroundPosition: "200% 0" }}
                animate={{ backgroundPosition: "0 0" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent bg-[size:200%]"
              >
                Adopt a Student
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              To adopt a student is to embrace their journey, foster their
              talents, and ignite their dreams.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              <button
                onClick={scrollToCourses}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-8"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Image Card Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-6xl"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                >
                  Transforming Education Through Partnership
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-lg leading-relaxed mb-8"
                >
                  Join us in shaping the future of technical education in Madhya
                  Pradesh. Your investment in student seats creates
                  opportunities that transform lives and builds a stronger
                  tomorrow.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={scrollToCourses}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    SStart Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-10" />
                <img
                  src={landingImage}
                  alt="Education Initiative"
                  className="w-full h-full object-cover object-center"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Existing Course Cards Section */}
      <section ref={coursesRef} className="p-4 lg:p-6 scroll-mt-24">
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
                        className: `h-6 w-6 ${colorConfig.icon} group-hover:text-white`,
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

      {/* Enhanced Investment Steps */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-48 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-48 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
              Investment Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Path to Educational Investment
            </h2>
            <p className="text-blue-100/80 max-w-2xl mx-auto text-lg">
              Follow our streamlined process to make impactful investments in
              education
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Select Your Course",
                description:
                  "Choose from our curated selection of B.Tech, ITI, or Diploma programs",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Choose Region",
                description:
                  "Pick your preferred location across Madhya Pradesh",
                color: "from-purple-400 to-purple-600",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Configure Investment",
                description: "Specify seats and select your preferred branches",
                color: "from-cyan-400 to-cyan-600",
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "Secure Your Investment",
                description:
                  "Complete the process with our secure confirmation system",
                color: "from-emerald-400 to-emerald-600",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 group"
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg`}
                  >
                    {step.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-blue-100/70">{step.description}</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    x: ["100%", "-100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto relative"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Shape the Future?
              </h2>
              <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
                Join us in transforming education in Madhya Pradesh. Your
                investment today creates tomorrow&apos;s leaders.
              </p>
              <motion.button
                onClick={scrollToCourses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all shadow-xl flex items-center mx-auto space-x-3 group"
              >
                <span>Begin Your Investment Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              className="p-4 bg-blue-600/10 rounded-full"
            >
              <Globe className="w-10 h-10 text-blue-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">
              Global Investor Summit
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              Transforming education through strategic investments
            </p>
            <div className="h-px w-24 bg-gray-800 my-6"></div>
            <p className="text-sm text-gray-500">
              © 2025 Global Investor Summit. All rights reserved.
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default LandingPage;
