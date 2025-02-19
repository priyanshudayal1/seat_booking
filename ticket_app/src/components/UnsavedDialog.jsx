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
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-white/20"
          >
            <div className="flex flex-col items-center text-center space-y-4">
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
                  className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-500/10"
                />

                {/* Inner circle with alert icon */}
                <motion.div className="relative w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
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
                    <AlertTriangle className="w-10 h-10 text-yellow-600" />
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
                  className="absolute inset-0 w-16 h-16 rounded-full bg-yellow-500/20 blur-xl"
                />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {isPaymentNavigation ? "Confirm Selection" : "Unsaved Changes"}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                {isPaymentNavigation
                  ? "Do you want to confirm your current selections and proceed to payment?"
                  : "You have unsaved course selections. Do you want to keep your current selections and continue?"}
              </motion.p>

              <div className="flex w-full space-x-3 mt-6">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-lg
                    hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 
                    shadow-lg shadow-yellow-500/25 font-medium"
                >
                  {isPaymentNavigation
                    ? "Confirm & Proceed"
                    : "Keep & Continue"}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onCancel}
                  className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-200
                    hover:bg-gray-50 transition-all duration-200 font-medium
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
