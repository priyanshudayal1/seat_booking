import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Check,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import useCourseSelection from "../../store/useCourseSelection";
import StateMap from "./Map";
import { motion } from "framer-motion";

const LoadingState = () => (
  <div className="max-w-5xl mx-auto p-8">
    <div className="animate-pulse space-y-6">
      <div className="h-[600px] bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const CourseStep = ({ course, onSelect, isSelected }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="space-y-1.5 w-full sm:w-auto">
        <h3 className="text-base font-semibold text-gray-800">
          {course.branch}
        </h3>
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
            {course.course_name}
          </span>
          <span className="text-xs text-gray-500">
            ({course.left_seats}/{course.total_seats} seats)
          </span>
        </div>
        <p className="text-lg lg:text-xl font-bold text-blue-600">
          ₹{parseFloat(course.price_per_seat).toLocaleString()}
        </p>
      </div>
      <div className="space-y-3 w-full sm:w-auto">
        <motion.label
          className="relative flex items-center cursor-pointer group space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(course.id, e.target.checked)}
              className="peer sr-only"
              disabled={course.left_seats === 0}
            />
            <div
              className={`w-5 h-5 border-2 rounded-lg 
              transition-all duration-200 flex items-center justify-center
              group-hover:shadow-md relative
              ${
                course.left_seats === 0
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                  : "border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 group-hover:border-blue-400 peer-checked:group-hover:bg-blue-600"
              }`}
            >
              <motion.div
                initial={false}
                animate={isSelected ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </div>
          <span className={`text-xs font-medium transition-colors
            ${course.left_seats === 0 ? "text-gray-400" : "text-gray-600 group-hover:text-gray-800"}`}
          >
            {course.left_seats === 0 ? "No seats available" : "Select Course"}
          </span>
        </motion.label>
      </div>
    </div>
  </motion.div>
);

const NoCourses = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="col-span-2 p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center"
  >
    <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 mb-2">No courses available in this city</p>
    <p className="text-sm text-gray-400">Please select another city</p>
  </motion.div>
);

const NewCourseSelection = () => {
  const { courses = [], fetchCourses, isLoading, reset } = useCourseSelection();
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const cities = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    
    const uniqueCities = [...new Set(courses.map(course => course.city))];
    return uniqueCities.sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!selectedCity || !Array.isArray(courses)) return [];
    
    return courses.filter(course => course.city === selectedCity);
  }, [courses, selectedCity]);

  const handleCourseSelect = () => {
    reset(); // Reset any existing selections before navigating
    navigate(`/dashboard/city/${selectedCity}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
        {!selectedCity ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Select Your City
            </h1>
            <StateMap selectedCity={selectedCity} cities={cities} onCitySelect={setSelectedCity} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedCity(null)}
                  className="flex items-center justify-center h-10 px-4 rounded-lg 
                    bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800
                    border border-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to Map
                </button>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Courses in {selectedCity}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseStep
                    key={course.id}
                    course={course}
                    onSelect={handleCourseSelect}
                    isSelected={false}
                  />
                ))
              ) : (
                <NoCourses />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewCourseSelection;