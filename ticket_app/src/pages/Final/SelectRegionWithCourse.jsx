import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Check, ChevronLeft, AlertCircle, MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import useCourseSelection from "../../store/useCourseSelection";
import StateMap from "../Dashboard/Map";
import { titleCase } from "../../lib/utils";

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="animate-pulse space-y-6 max-w-7xl mx-auto">
      <div className="h-16 bg-gray-200 rounded-xl w-1/3" />
      <div className="h-[calc(100vh-12rem)] bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const CourseStep = ({ course, onSelect, isSelected }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group backdrop-blur-sm"
  >
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {titleCase(course.branch)}
        </h3>
        <div className="flex items-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {course.course_name}
          </span>
          <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
            {course.left_seats}/{course.total_seats} seats
          </span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-2xl font-bold text-blue-600">
            ₹{parseFloat(course.price_per_seat).toLocaleString()}
          </p>
          <motion.label
            className="relative flex items-center cursor-pointer group space-x-3"
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
                className={`w-6 h-6 border-2 rounded-xl 
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
                  animate={
                    isSelected
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.5 }
                  }
                  transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>
            <span
              className={`text-sm font-medium transition-colors
              ${
                course.left_seats === 0
                  ? "text-gray-400"
                  : "text-gray-600 group-hover:text-gray-800"
              }`}
            >
              {course.left_seats === 0 ? "No seats available" : "Select Course"}
            </span>
          </motion.label>
        </div>
      </div>
    </div>
  </motion.div>
);

const NoCourses = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="col-span-2 p-16 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center"
  >
    <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
      <AlertCircle className="w-10 h-10 text-gray-400" />
    </div>
    <p className="text-lg text-gray-600 mb-2 font-medium">No courses available in this city</p>
    <p className="text-gray-400">Please select another city to continue</p>
  </motion.div>
);

const SelectRegionWithCourse = () => {
  const { courses = [], fetchCourses, isLoading } = useCourseSelection();
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const { courseType } = useParams();

  useEffect(() => {
    if (!courses || courses.length === 0) {
      fetchCourses();
    }
  }, [courses, fetchCourses]);

  // Add city stats calculation
  const cityStats = useMemo(() => {
    if (!Array.isArray(courses)) return {};

    return courses.reduce((acc, course) => {
      if (!course.city) return acc;

      if (!acc[course.city]) {
        acc[course.city] = {
          total_seats: 0,
          locked_seats: 0,
          available_seats: 0,
        };
      }

      acc[course.city].total_seats += course.total_seats || 0;
      acc[course.city].available_seats += course.left_seats || 0;
      acc[course.city].locked_seats +=
        course.total_seats - course.left_seats || 0;

      return acc;
    }, {});
  }, [courses]);

  const cities = useMemo(() => {
    if (!Array.isArray(courses)) return [];

    // Filter courses by course type if specified
    const filteredCourses = courseType
      ? courses.filter((course) => course.course_name === courseType)
      : courses;

    const uniqueCities = [
      ...new Set(filteredCourses.map((course) => course.city)),
    ].sort();
    return uniqueCities;
  }, [courses, courseType]);

  const filteredCourses = useMemo(() => {
    if (!selectedCity || !Array.isArray(courses)) return [];

    // Filter by both city and course type
    return courses.filter(
      (course) =>
        course.city === selectedCity &&
        (!courseType || course.course_name === courseType)
    );
  }, [courses, selectedCity, courseType]);

  const handleCourseSelect = () => {
    const path = courseType
      ? `/course-list/${selectedCity}/${courseType}`
      : `/course-list/${selectedCity}`;
    navigate(path);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-8xl mx-auto p-4 lg:p-8">
        {!selectedCity ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <MapIcon className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {courseType
                  ? `Select City for ${courseType} Courses`
                  : "Select Your City"}
              </h1>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
              <StateMap
                selectedCity={selectedCity}
                cities={cities}
                onCitySelect={setSelectedCity}
                selectedCourseType={courseType}
                cityData={cityStats}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setSelectedCity(null)}
                  className="flex items-center justify-center h-12 px-6 rounded-xl 
                    bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900
                    border border-gray-200 transition-all shadow-sm hover:shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back to Map
                </motion.button>
                <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-sm">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {courseType
                      ? `${courseType} Courses in ${selectedCity}`
                      : `Courses in ${selectedCity}`}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelectRegionWithCourse;
