import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  School,
  GraduationCap,
  BookOpen,
  Building,
  AlertCircle,
} from "lucide-react";
import useCourseSelection from "../../store/useCourseSelection";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import UnsavedChangesDialog from "../../components/UnsavedDialog";

const StepIndicator = ({ step, isActive, isCompleted }) => (
  <div className="relative flex-shrink-0">
    <motion.div
      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center z-10 relative
        touch-manipulation shadow-sm ${
        isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-200"
      }`}
      animate={{
        scale: isActive ? 1.1 : 1,
        backgroundColor: isCompleted
          ? "#22c55e"
          : isActive
          ? "#3b82f6"
          : "#e5e7eb",
      }}
    >
      {isCompleted ? (
        <Check className="text-white w-4 h-4 lg:w-5 lg:h-5" />
      ) : (
        <span className="text-white text-xs lg:text-sm font-semibold">
          {step}
        </span>
      )}
    </motion.div>
  </div>
);

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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
                    ? {
                        opacity: 1,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        scale: 0.5,
                      }
                }
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 500,
                }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 bg-blue-400 rounded-lg"
                />
              )}
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

const NoCourses = ({ courseName }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="col-span-2 p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center"
  >
    <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <BookOpen className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 mb-2">
      No {courseName} courses are currently available
    </p>
    <p className="text-sm text-gray-400">
      Please check back later or explore other categories
    </p>
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

const CategorySummary = ({ selections, courses, currentType }) => {
  const currentTypeSelections = Object.entries(selections)
    .filter(([courseId, value]) => {
      const course = courses.find((c) => c.id === courseId);
      return course?.course_name === currentType && value.isSelected;
    })
    .reduce(
      (acc, [courseId, value]) => {
        const course = courses.find((c) => c.id === courseId);
        acc.totalSeats += value.seats || 0;
        acc.totalAmount += value.seats * parseFloat(course.price_per_seat) || 0;
        return acc;
      },
      { totalSeats: 0, totalAmount: 0 }
    );

  if (currentTypeSelections.totalSeats === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <span className="text-blue-600 font-medium">
          {currentType} Selection:
        </span>
        <span className="text-gray-600">
          {currentTypeSelections.totalSeats} seats selected
        </span>
      </div>
      <div className="text-blue-600 font-semibold">
        {formatPrice(currentTypeSelections.totalAmount)}
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="max-w-5xl mx-auto p-8">
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((j) => (
                <div key={j} className="h-48 bg-gray-200 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
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
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  </div>
);

const CourseSelection = () => {
  const {
    courses,
    updateCourseSelection,
    updateSelections,
    selections: savedSelections,
    fetchCourses,
    isLoading,
    setCurrentStep,
    error,
  } = useCourseSelection();

  const [localSelections, setLocalSelections] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStepLocal] = useState(1);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [attemptedPath, setAttemptedPath] = useState(null);

  // Initialize local selections from savedSelections
  useEffect(() => {
    if (!isDirty && courses.length > 0 && savedSelections) {
      const newSelections = {};
      courses.forEach((course) => {
        const savedSelection = savedSelections[course.id];
        newSelections[course.id] = {
          isSelected: savedSelection?.isSelected || false,
          seats: savedSelection?.seats || "0",
          totalPrice: savedSelection?.totalPrice || 0,
        };
      });
      setLocalSelections(newSelections);
    }
  }, [courses, savedSelections, isDirty]);

  // Sync to store only when explicitly calling updateStore
  const updateStore = useCallback(() => {
    if (isDirty) {
      updateSelections(localSelections);
      setIsDirty(false);
    }
  }, [isDirty, localSelections, updateSelections]);

  // Update store when navigating away
  useEffect(() => {
    return () => {
      if (isDirty) {
        updateStore();
      }
    };
  }, [isDirty, updateStore]);

  const courseTypes = useMemo(
    () => [
      { name: "M.Tech", icon: School },
      { name: "B.Tech", icon: GraduationCap },
      { name: "Diploma", icon: BookOpen },
      { name: "ITI", icon: Building },
    ],
    []
  );

  useEffect(() => {
    const initializeCourses = async () => {
      const fetchedCourses = await fetchCourses();

      if (Array.isArray(fetchedCourses)) {
        const validCourses = fetchedCourses.filter((course) => {
          if (
            !course ||
            !course.id ||
            !course.price_per_seat ||
            !course.course_name
          ) {
            console.error("Invalid course data:", course);
            return false;
          }
          return true;
        });

        if (validCourses.length !== fetchedCourses.length) {
          toast.error("Some courses have invalid data and were filtered out");
        }
      }
    };

    initializeCourses();
  }, [fetchCourses]);

  const currentCourses = useMemo(() => {
    return courses
      .filter((c) => c.course_name === courseTypes[currentStep - 1].name)
      .map((course) => ({
        ...course,
        id: course.id.toString(),
      }))
      .sort((a, b) => a.branch.localeCompare(b.branch));
  }, [courses, currentStep, courseTypes]);

  const Icon = courseTypes[currentStep - 1].icon;

  const handleCourseSelect = (courseId, isSelected) => {
    if (!courseId) {
      console.error("Invalid courseId:", courseId);
      return;
    }

    setLocalSelections((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        isSelected,
        seats: isSelected ? "1" : "", // Set to 1 when selected, empty when deselected
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

    setLocalSelections((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        seats: seats || "", // Allow empty string but maintain selection
        isSelected: prev[courseId]?.isSelected, // Maintain selection state
        totalPrice: seatCount * pricePerSeat,
      },
    }));
    setIsDirty(true);
  };

  const handleNextStep = () => {
    if (isDirty) {
      updateStore();
    }

    const currentSelections = Object.entries(localSelections)
      .filter(([, value]) => value.isSelected && value.seats > 0)
      .reduce((acc, [courseId, value]) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course || !course.price_per_seat) {
          return acc;
        }

        acc[courseId] = {
          selectedSeats: value.seats,
          pricePerSeat: parseFloat(course.price_per_seat),
          totalPrice: value.seats * parseFloat(course.price_per_seat),
          branch: course.branch,
          courseName: course.course_name,
        };
        return acc;
      }, {});

    if (
      currentStep === courseTypes.length &&
      Object.keys(currentSelections).length === 0
    ) {
      toast.error("Please select at least one course with seats");
      return;
    }

    updateCourseSelection(currentSelections);

    if (currentStep === courseTypes.length) {
      navigate("/dashboard/payment");
    } else {
      const nextStep = currentStep + 1;
      setCurrentStepLocal(nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStepLocal(prevStep);
    setCurrentStep(prevStep);
  };

  const hasUnsavedChanges = useMemo(() => {
    return Object.keys(localSelections).length > 0;
  }, [localSelections]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
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

  const handleRetry = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-2 lg:p-8 min-h-[calc(100vh-64px)] flex flex-col">
        <div className="bg-white rounded-2xl shadow-xl p-4 pb-20 lg:p-8 lg:pb-20 relative flex flex-col flex-1">
          <div className="flex-shrink-0 mb-4 lg:mb-6">
            <div className="flex justify-between items-center mb-4 lg:mb-8">
              <div className="grid grid-cols-4 w-full max-w-lg mx-auto px-4">
                {courseTypes.map((_, index) => (
                  <div key={index} className="flex items-center justify-center relative">
                    <StepIndicator
                      step={index + 1}
                      isActive={currentStep === index + 1}
                      isCompleted={currentStep > index + 1}
                    />
                    {index < courseTypes.length - 1 && (
                      <div
                        className={`absolute h-0.5 w-[calc(100%-1.5rem)] left-[60%] top-1/2 -translate-y-1/2 ${
                          currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-0.5 pb-16">
            <SelectionSummary selections={localSelections} courses={courses} />

            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Icon className="text-blue-500 w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <h2 className="text-lg lg:text-2xl font-bold text-gray-800 truncate">
                  {courseTypes[currentStep - 1].name} Courses
                </h2>
              </div>

              <CategorySummary
                selections={localSelections}
                courses={courses}
                currentType={courseTypes[currentStep - 1].name}
              />

              <div className="grid gap-4 lg:gap-6 md:grid-cols-2 pb-4">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
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
                  <NoCourses courseName={courseTypes[currentStep - 1].name} />
                )}
              </div>
            </div>
          </div>

          <div className="fixed sm:absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/95 backdrop-blur-sm sm:backdrop-blur-none border-t">
            <div className="flex justify-between items-center gap-4 max-w-5xl mx-auto">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center justify-center h-11 px-4 sm:px-6 rounded-lg 
                    bg-white/95 backdrop-blur-sm sm:backdrop-blur-none text-gray-600 hover:text-gray-800 hover:bg-gray-50/95
                    border border-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
              ) : <div className="w-[68px] sm:w-[106px]" />}
              
              <button
                onClick={handleNextStep}
                className="flex items-center justify-center h-11 px-4 sm:px-6 rounded-lg 
                  bg-blue-500/95 backdrop-blur-sm sm:backdrop-blur-none text-white hover:bg-blue-600/95 transition-colors shadow-sm"
              >
                <span className="mr-1">
                  {currentStep === courseTypes.length ? "Complete" : "Next"}
                </span>
                {currentStep === courseTypes.length ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
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

export default CourseSelection;
