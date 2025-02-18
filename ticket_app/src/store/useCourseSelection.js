import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

const useCourseSelection = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      courses: [],
      coursesByCategory: {
        "M.Tech": [],
        "B.Tech": [],
        Diploma: [],
        Polytechnic: [],
        ITI: [],
      },
      selectedCourses: {},
      selections: {},
      isLoading: false,
      error: null,
      courseData: null,

      fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/user/courses");
          const coursesByCategory = {
            "M.Tech": [],
            "B.Tech": [],
            Diploma: [],
            Polytechnic: [],
            ITI: [],
          };

          // Validate course data
          const validCourses = response.data.filter((course) => {
            const isValid =
              course &&
              course.id &&
              course.price_per_seat &&
              course.course_name &&
              course.total_seats >= 0 &&
              course.left_seats >= 0 &&
              course.locked_seats >= 0;

            if (!isValid) {
              console.error("Invalid course data:", course);
            }
            return isValid;
          });

          validCourses.forEach((course) => {
            if (coursesByCategory[course.course_name]) {
              coursesByCategory[course.course_name].push({
                ...course,
                id: course.id.toString(),
                price_per_seat: parseFloat(course.price_per_seat),
                total_seats: parseInt(course.total_seats),
                left_seats: parseInt(course.left_seats),
                locked_seats: parseInt(course.locked_seats),
              });
            }
          });

          // Sort branches within each category
          Object.keys(coursesByCategory).forEach((category) => {
            coursesByCategory[category].sort((a, b) =>
              a.branch.localeCompare(b.branch)
            );
          });

          const sortedCourses = [
            ...coursesByCategory["M.Tech"],
            ...coursesByCategory["B.Tech"],
            ...coursesByCategory["Diploma"],
            ...coursesByCategory["Polytechnic"],
            ...coursesByCategory["ITI"],
          ];

          if (sortedCourses.length === 0) {
            throw new Error("No valid courses available");
          }

          set({
            courses: sortedCourses,
            coursesByCategory,
            isLoading: false,
            error: null,
          });

          return sortedCourses;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch courses";
          set({
            error: errorMessage,
            isLoading: false,
            courses: [],
            coursesByCategory: {
              "M.Tech": [],
              "B.Tech": [],
              Diploma: [],
              Polytechnic: [],
              ITI: [],
            },
          });
          return [];
        }
      },

      // Update intermediate selections
      updateSelections: (selections) => {
        const currentSelections = get().selections;
        const hasChanged =
          JSON.stringify(selections) !== JSON.stringify(currentSelections);

        if (!hasChanged) return; // Skip update if nothing changed

        // Validate selections
        const validSelections = {};
        let hasValidChanges = false;

        Object.entries(selections).forEach(([courseId, selection]) => {
          const course = get().courses.find((c) => c.id === courseId);
          if (!course) return;

          const seats = parseInt(selection.seats) || 0;
          if (seats > course.left_seats) {
            console.error(
              `Selected seats (${seats}) exceed available seats (${course.left_seats}) for course ${courseId}`
            );
            return;
          }

          const newSelection = {
            ...selection,
            seats,
            totalPrice: seats * parseFloat(course.price_per_seat),
          };

          if (
            JSON.stringify(newSelection) !==
            JSON.stringify(currentSelections[courseId])
          ) {
            validSelections[courseId] = newSelection;
            hasValidChanges = true;
          } else {
            validSelections[courseId] = currentSelections[courseId];
          }
        });

        if (hasValidChanges) {
          set({ selections: validSelections });
        }
      },

      // Update final course selections
      updateCourseSelection: (selections) => {
        set({ selectedCourses: selections });
      },

      // Reset store state
      reset: () =>
        set(
          {
            currentStep: 0,
            selectedCourses: {},
            selections: {},
            error: null,
            courseData: null,
          },
          true
        ),

      // Get current step's courses
      getCurrentStepCourses: () => {
        const { courses, currentStep } = get();
        const courseTypes = [
          "M.Tech",
          "B.Tech",
          "Diploma",
          "Polytechnic",
          "ITI",
        ];
        return courses.filter(
          (c) => c.course_name === courseTypes[currentStep - 1]
        );
      },

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "course-selection-storage",
      partialize: (state) => ({
        selections: state.selections,
        selectedCourses: state.selectedCourses,
        currentStep: state.currentStep,
      }),
    }
  )
);

export default useCourseSelection;
