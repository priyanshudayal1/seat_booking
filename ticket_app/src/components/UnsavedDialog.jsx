import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const UnsavedChangesDialog = ({ isOpen, onConfirm, onCancel, nextPath }) => {
  const isPaymentNavigation = nextPath?.includes('/payment');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-[2px] bg-black/40 flex items-center justify-center z-50 p-3"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-xl p-5 max-w-sm w-full mx-auto relative shadow-xl border border-gray-100"
          >
            <button
              onClick={onCancel}
              className="absolute right-3 top-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-50 rounded-full shadow-sm border border-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isPaymentNavigation ? 'Confirm Selection' : 'Unsaved Changes'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isPaymentNavigation
                    ? 'Do you want to confirm your current selections and proceed to payment?'
                    : 'You have unsaved course selections. Do you want to keep your current selections and continue?'}
                </p>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => {
                      if (isPaymentNavigation) {
                        // For payment navigation, maintain selections and proceed
                        onConfirm();
                      } else {
                        // For other navigations, maintain current selections
                        onConfirm();
                      }
                    }}
                    className="flex-1 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    active:bg-blue-700 transition-colors duration-150 text-sm font-medium shadow-sm 
                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isPaymentNavigation ? 'Confirm & Proceed' : 'Keep & Continue'}
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex-1 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 
                    active:bg-gray-200 transition-colors duration-150 text-sm font-medium border border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {isPaymentNavigation ? 'Review Selection' : 'Stay Here'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnsavedChangesDialog;
