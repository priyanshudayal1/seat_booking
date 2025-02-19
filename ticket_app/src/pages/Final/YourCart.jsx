import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShoppingCart,
  Plus,
  Building2,
  MapPin,
  BookOpen,
} from "lucide-react";
import useCourseSelection from "../../store/useCourseSelection";

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const GroupHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-3 mb-3 mt-6">
    <div className="p-2 bg-blue-50 rounded-lg">
      <Icon className="w-5 h-5 text-blue-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <div className="h-px flex-1 bg-gray-100"></div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-gray-900">{course.branch}</h4>
        <p className="text-sm text-gray-500 mt-1">{course.courseName}</p>
        <div className="flex items-center mt-2 space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{course.institute}</span>
        </div>
        <div className="flex items-center mt-1 space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{course.city}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(course.totalPrice)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {course.selectedSeats} seats × {formatPrice(course.pricePerSeat)}
        </div>
      </div>
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <ShoppingCart className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Your cart is empty
    </h3>
    <p className="text-gray-500 mb-6">
      Start by selecting courses you&apos;re interested in
    </p>
    <button
      onClick={() => (window.location.href = "/")}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      <Plus className="w-4 h-4 mr-2" /> Browse Courses
    </button>
  </div>
);

const YourCart = () => {
  const navigate = useNavigate();
  const selectedCourses = useCourseSelection((state) => state.selectedCourses);

  // Group courses by type, city, and institute
  const groupedCourses = Object.values(selectedCourses).reduce(
    (acc, course) => {
      const courseType = course.courseName.toUpperCase();
      const city = course.city;

      if (!acc[courseType]) acc[courseType] = {};
      if (!acc[courseType][city]) acc[courseType][city] = [];

      acc[courseType][city].push(course);
      return acc;
    },
    {}
  );

  const totalAmount = Object.values(selectedCourses).reduce(
    (sum, course) => sum + parseFloat(course.totalPrice),
    0
  );

  if (Object.keys(selectedCourses).length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Add More
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedCourses).map(([courseType, cities]) => (
            <div key={courseType}>
              <GroupHeader icon={BookOpen} title={courseType} />
              {Object.entries(cities).map(([city, courses]) => (
                <div key={city} className="mb-6">
                  <div className="flex items-center space-x-2 mb-3 ml-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <h4 className="font-medium text-gray-700">{city}</h4>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">Total Amount:</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(totalAmount)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/payment")}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              Proceed to Payment <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default YourCart;
