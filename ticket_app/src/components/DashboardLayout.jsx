import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, User, LogOut, Book, Layout, ChevronRight, Menu, X, Map } from "lucide-react";
import useLoginStore from "../store/useLogin";
import { useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLoginStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isInCourseSelection =
    location.pathname.includes("course-selection") ||
    location.pathname.includes("payment");

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar - Responsive */}
      <div className="lg:w-72 z-50">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 z-50">
          <div className="p-3 flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100/80 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">Seat Adoption</h1>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-xl border-r border-gray-100 w-72 lg:w-72 z-40 overflow-hidden`}>
          <div className="lg:hidden p-3 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-white" />
              <h1 className="text-lg font-bold text-white">Seat Adoption</h1>
            </div>
          </div>
          <div className="hidden lg:block p-4 lg:p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <Layout className="w-6 h-6 text-white" />
              <h1 className="text-xl lg:text-2xl font-bold text-white">Seat Adoption</h1>
            </div>
          </div>
          <nav className="h-[calc(100vh-65px)] lg:h-[calc(100vh-88px)] overflow-y-auto pt-16 lg:pt-0 hide-scrollbar">
            <div className="p-2 lg:p-4 space-y-1 lg:space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center p-3 lg:p-4 rounded-xl transition-all duration-200 group ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <Home
                  className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    location.pathname === "/dashboard"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span className="font-medium">Dashboard</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                    location.pathname === "/dashboard"
                      ? "text-blue-600 opacity-100"
                      : "opacity-0"
                  }`}
                />
              </Link>

              <Link
                to="/dashboard/map"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center p-3 lg:p-4 rounded-xl transition-all duration-200 group ${
                  location.pathname === "/dashboard/map"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <Map
                  className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    location.pathname === "/dashboard/map"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span className="font-medium">Region Selection</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                    location.pathname === "/dashboard/map"
                      ? "text-blue-600 opacity-100"
                      : "opacity-0"
                  }`}
                />
              </Link>

              {isInCourseSelection && (
                <div className="flex-shrink-0 flex items-center p-3 lg:p-4 rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                  <Book className="w-5 h-5 mr-3" />
                  <span className="font-medium">Course Selection</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </div>
              )}

              <Link
                to="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex-shrink-0 flex items-center p-3 lg:p-4 rounded-xl transition-all duration-200 group ${
                  location.pathname === "/dashboard/profile"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <User
                  className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    location.pathname === "/dashboard/profile"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span className="font-medium">Profile</span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                    location.pathname === "/dashboard/profile"
                      ? "text-blue-600 opacity-100"
                      : "opacity-0"
                  }`}
                />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center p-3 lg:p-4 rounded-xl w-full text-left transition-all duration-200 group hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              >
                <LogOut className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>

          <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Seat Adoption
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>

      {/* Main Content - Responsive */}
      <div className="flex-1 overflow-auto mt-16 lg:mt-0">
        <Outlet />
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
