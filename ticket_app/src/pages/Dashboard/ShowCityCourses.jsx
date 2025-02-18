import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useBlocker } from "react-router-dom";
import {
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import useCourseSelection from "../../store/useCourseSelection";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import UnsavedChangesDialog from "../../components/UnsavedDialog";

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const LoadingState = () => (
  <div className="max-w-5xl mx-auto p-8">
    <div className="animate-pulse space-y-6">
      <div className="h-[600px] bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const CourseStep = ({ course, seats, onSeatChange, onSelect, isSelected }) => (
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
          {formatPrice(course.price_per_seat)}
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
            className={`text-xs font-medium transition-colors
            ${
              course.left_seats === 0
                ? "text-gray-400"
                : "text-gray-600 group-hover:text-gray-800"
            }`}
          >
            {course.left_seats === 0 ? "No seats available" : "Select Course"}
          </span>
        </motion.label>
        {isSelected && (
          <motion.div
            className="relative flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative group flex-1">
              <input
                type="number"
                min="1"
                max={course.left_seats}
                value={
                  seats === undefined || seats === null ? "" : String(seats)
                }
                onChange={(e) => onSeatChange(course.id, e.target.value)}
                className="w-full sm:w-28 p-2 text-sm border-2 border-gray-200 rounded-lg 
                  focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                  transition-all bg-gray-50 group-hover:bg-white group-hover:shadow-md
                  placeholder:text-gray-400 [appearance:textfield] 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={`Max ${course.left_seats}`}
              />
              <div className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  seats
                </span>
              </div>
            </div>
            {seats > 0 && (
              <div className="text-sm font-medium text-blue-600">
                {formatPrice(seats * parseFloat(course.price_per_seat))}
              </div>
            )}
          </motion.div>
        )}
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
      <BookOpen className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 mb-2">No courses available in this city</p>
    <p className="text-sm text-gray-400">Please select another city</p>
  </motion.div>
);

const SelectionSummary = ({ selections, courses }) => {
  const selectedCount = Object.values(selections).filter(
    (s) => s.isSelected
  ).length;

  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="text-sm font-medium text-blue-800 mb-2">
        Selected Courses Summary:
      </h3>
      <div className="space-y-2">
        {Object.entries(selections)
          .filter(([, value]) => value.isSelected)
          .map(([courseId, value]) => {
            const course = courses.find((c) => c.id === courseId);
            if (!course) return null;
            return (
              <div key={courseId} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {course.branch} ({course.course_name})
                </span>
                <span className="text-blue-600 font-medium">
                  {value.seats} seats
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ShowCityCourses = () => {
  const { city } = useParams();
  const { courses = [], updateSelections, fetchCourses, isLoading, error, reset } = useCourseSelection();
  const [localSelections, setLocalSelections] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [attemptedPath, setAttemptedPath] = useState(null);
  const navigate = useNavigate();

  // Reset all selections when component mounts
  useEffect(() => {
    reset(); // Reset global store selections
    setLocalSelections({}); // Reset local selections
    setIsDirty(false); // Reset dirty state
    fetchCourses(); // Fetch fresh courses
  }, [reset, fetchCourses]);

  const cityCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    
    return courses
      .filter((course) => course.city === city)
      .sort((a, b) => {
        // Sort by course_name first
        const courseNameCompare = a.course_name.localeCompare(b.course_name);
        if (courseNameCompare !== 0) return courseNameCompare;
        // Then by branch name
        return a.branch.localeCompare(b.branch);
      });
  }, [courses, city]);

  const handleCourseSelect = (courseId, isSelected) => {
    if (courses.find((c) => c.id === courseId)?.left_seats === 0) {
      toast.error("No seats available for this course");
      return;
    }

    setLocalSelections((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        isSelected,
        seats: isSelected ? "1" : "",
        totalPrice: isSelected
          ? parseFloat(
              courses.find((c) => c.id === courseId)?.price_per_seat || 0
            )
          : 0,
      },
    }));
    setIsDirty(true);
  };

  const handleSeatChange = (courseId, seats) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      toast.error("Invalid course selection");
      return;
    }

    const seatCount = parseInt(seats) || 0;
    const pricePerSeat = parseFloat(course.price_per_seat) || 0;

    if (seatCount > course.left_seats) {
      toast.error(`Maximum available seats: ${course.left_seats}`);
      return;
    }

    if (seatCount < 0) {
      toast.error("Number of seats cannot be negative");
      return;
    }

    setLocalSelections((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        seats: seats || "",
        isSelected: seats ? true : prev[courseId]?.isSelected,
        totalPrice: seatCount * pricePerSeat,
      },
    }));
    setIsDirty(true);
  };

  const handleProceed = () => {
    const currentSelections = Object.entries(localSelections)
      .filter(([, value]) => value.isSelected && parseInt(value.seats) > 0)
      .reduce((acc, [courseId, value]) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course || !course.price_per_seat) {
          return acc;
        }

        acc[courseId] = {
          id: courseId,
          selectedSeats: parseInt(value.seats),
          pricePerSeat: parseFloat(course.price_per_seat),
          totalPrice: parseInt(value.seats) * parseFloat(course.price_per_seat),
          branch: course.branch,
          courseName: course.course_name,
          city: course.city,
        };
        return acc;
      }, {});

    if (Object.keys(currentSelections).length === 0) {
      toast.error("Please select at least one course with seats");
      return;
    }

    // Update both selections and selectedCourses in the store
    updateSelections(currentSelections);
    useCourseSelection.getState().updateCourseSelection(currentSelections);
    navigate("/dashboard/payment");
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setAttemptedPath(blocker.location.pathname);
      setShowUnsavedDialog(true);
    }
  }, [blocker]);

  const handleConfirmNavigation = () => {
    setShowUnsavedDialog(false);
    if (attemptedPath) {
      blocker.proceed?.();
      setAttemptedPath(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Failed to Load Courses
            </h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => fetchCourses()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-2 lg:p-8 min-h-[calc(100vh-64px)] flex flex-col">
        <div className="bg-white rounded-2xl shadow-xl p-4 pb-20 lg:p-8 lg:pb-20 relative flex flex-col flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center h-10 px-4 rounded-lg 
                  bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800
                  border border-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800">
                  Courses in {city}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-0.5 pb-16">
            <SelectionSummary selections={localSelections} courses={courses} />

            <div className="grid gap-4 lg:gap-6 md:grid-cols-2 pb-4">
              {cityCourses.length > 0 ? (
                cityCourses.map((course) => (
                  <CourseStep
                    key={course.id}
                    course={course}
                    seats={localSelections[course.id]?.seats}
                    onSeatChange={handleSeatChange}
                    onSelect={handleCourseSelect}
                    isSelected={localSelections[course.id]?.isSelected}
                  />
                ))
              ) : (
                <NoCourses />
              )}
            </div>
          </div>

          <div className="fixed sm:absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/95 backdrop-blur-sm sm:backdrop-blur-none border-t">
            <div className="flex justify-end items-center gap-4 max-w-5xl mx-auto">
              <button
                onClick={handleProceed}
                className="flex items-center justify-center h-11 px-6 rounded-lg 
                  bg-blue-500/95 backdrop-blur-sm sm:backdrop-blur-none text-white hover:bg-blue-600/95 
                  transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={Object.keys(localSelections).length === 0}
              >
                <span className="mr-2">Proceed to Payment</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(0,0,0,0.2) transparent;
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 4px;
          }
        `}
      </style>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={handleConfirmNavigation}
        onCancel={() => {
          setShowUnsavedDialog(false);
          blocker.reset?.();
          setAttemptedPath(null);
        }}
      />
    </>
  );
};

export default ShowCityCourses;
