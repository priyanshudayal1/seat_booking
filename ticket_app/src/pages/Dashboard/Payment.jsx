import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import useCourseSelection from "../../store/useCourseSelection";
import { CreditCard, Wallet, Building, AlertCircle, Loader2, ArrowLeft, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

const PaymentMethodCard = ({ icon: Icon, title, description, selected, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-3 sm:p-4 lg:p-6 rounded-xl cursor-pointer transition-all w-full ${
      selected
        ? "bg-blue-50 border-2 border-blue-500 shadow-blue-100"
        : "bg-white border-2 border-gray-100 hover:shadow-lg"
    }`}
    onClick={onSelect}
  >
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <Icon size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const CourseTable = ({ selections }) => (
  <div className="mt-4 sm:mt-6 overflow-hidden rounded-xl border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Branch
            </th>
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seats
            </th>
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price/Seat
            </th>
            <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(selections).map(([id, course]) => (
            <tr key={id} className="hover:bg-gray-50">
              <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-xs sm:text-sm font-medium text-gray-900">{course.courseName}</div>
              </td>
              <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-xs sm:text-sm text-gray-500">{course.branch}</div>
              </td>
              <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap">
                <div className="text-xs sm:text-sm text-gray-900">{course.selectedSeats}</div>
              </td>
              <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-right">
                <div className="text-xs sm:text-sm text-gray-900">{formatPrice(course.pricePerSeat)}</div>
              </td>
              <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-right">
                <div className="text-xs sm:text-sm font-medium text-blue-600">
                  {formatPrice(course.totalPrice)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan="4" className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 text-right font-medium text-gray-900">
              Total Amount:
            </td>
            <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-4 whitespace-nowrap text-right">
              <div className="text-base sm:text-lg font-bold text-blue-600">
                {formatPrice(
                  Object.values(selections)
                    .reduce((total, course) => total + (parseFloat(course.totalPrice) || 0), 0)
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

const OTPVerificationSection = ({ onVerified, loading, setLoading }) => {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const response = await api.post('//billing/generate-otp', {});
      toast.success("OTP sent successfully!");
      setPhoneNumber(response.data.phone);
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post('//billing/verify-otp', { otp });
      toast.success("OTP verified successfully!");
      onVerified();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lock className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold">Verify Your Phone Number</h3>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a verification code to your registered phone number.
          </p>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Sending OTP...</span>
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the OTP sent to {phoneNumber}
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                tracking-wider text-center"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              disabled={loading}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { selectedCourses, reset } = useCourseSelection();

  const paymentMethods = [
    {
      id: "card",
      icon: CreditCard,
      title: "Credit/Debit Card",
      description: "Pay securely with your card",
    },
    {
      id: "upi",
      icon: Wallet,
      title: "UPI Payment",
      description: "Pay using any UPI app",
    },
    {
      id: "netbanking",
      icon: Building,
      title: "Net Banking",
      description: "Pay through your bank account",
    },
  ];

  const totalAmount = Object.values(selectedCourses)
    .reduce((total, course) => total + course.totalPrice, 0);

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your phone number first");
      return;
    }

    setIsProcessing(true);
    try {
      const paymentResponse = await api.post(`//billing/process-payment`, {
        payment_method: paymentMethod,
      });

      if (paymentResponse.data.transaction_id) {
        toast.success("Payment successful!");
        reset();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/course-selection");
  };

  if (Object.keys(selectedCourses).length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded flex flex-col space-y-4">
          <div className="flex items-center">
            <AlertCircle className="text-orange-400 mr-3" />
            <p className="text-orange-700">
              No courses selected. Please select courses before proceeding to payment.
            </p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Course Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 lg:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Payment Details</h1>
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 flex items-center text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
        </div>

        <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:mx-0">
          <div className="inline-block min-w-full align-middle">
            <CourseTable selections={selectedCourses} />
          </div>
        </div>

        <OTPVerificationSection 
          onVerified={() => setIsVerified(true)}
          loading={isProcessing}
          setLoading={setIsProcessing}
        />

        <div className="mt-4 sm:mt-6 lg:mt-8">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Select Payment Method
          </h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ${!isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                {...method}
                selected={paymentMethod === method.id}
                onSelect={() => setPaymentMethod(method.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-end">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !paymentMethod || !isVerified}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors font-medium flex items-center justify-center gap-2
              disabled:bg-blue-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Proceed to Pay</span>
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
