import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const UnsavedChangesDialog = ({ isOpen, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-sm w-full mx-4 relative shadow-lg border border-gray-100"
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-yellow-50 rounded-full shadow-sm">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unsaved Changes
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                You have unsaved course selections. Are you sure you want to
                leave? Your changes will be lost.
              </p>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                >
                  Leave anyway
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium shadow-sm"
                >
                  Stay
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default UnsavedChangesDialog;
