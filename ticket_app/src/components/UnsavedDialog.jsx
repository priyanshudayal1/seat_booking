import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const UnsavedChangesDialog = ({ isOpen, onConfirm, onCancel, nextPath }) => {
  const isPaymentNavigation = nextPath?.includes("/cart");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white/90 backdrop-blur rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl border border-white/20"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                {/* Outer ring animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    opacity: [0, 0.8, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 0.7, 1],
                  }}
                  className="absolute inset-0 w-12 h-12 rounded-full bg-yellow-500/10"
                />

                {/* Inner circle with alert icon */}
                <motion.div className="relative w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.8,
                      ease: "easeInOut",
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <AlertTriangle className="w-7 h-7 text-yellow-600" />
                  </motion.div>
                </motion.div>

                {/* Glowing effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 w-12 h-12 rounded-full bg-yellow-500/20 blur-xl"
                />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900"
              >
                {isPaymentNavigation ? "Confirm Selection" : "Unsaved Changes"}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-600"
              >
                {isPaymentNavigation
                  ? "Do you want to confirm your current selections and proceed to lock?"
                  : "You have unsaved course selections. Do you want to keep your current selections and continue?"}
              </motion.p>

              <div className="flex w-full space-x-2 mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onConfirm}
                  className={`flex-1 bg-gradient-to-r ${
                    isPaymentNavigation
                      ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25"
                      : "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-500/25"
                  } text-white py-2 px-4 rounded-lg
                    transition-all duration-200 shadow-lg font-medium text-sm`}
                >
                  {isPaymentNavigation
                    ? "Confirm & Proceed"
                    : "Discard Changes"}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onCancel}
                  className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-200
                    hover:bg-gray-50 transition-all duration-200 font-medium text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {isPaymentNavigation ? "Review Selection" : "Stay Here"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnsavedChangesDialog;
