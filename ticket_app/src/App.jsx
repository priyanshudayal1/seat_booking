import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Profile from "./pages/Dashboard/Profile";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CourseSelection from "./pages/Dashboard/CourseSelection";
import Payment from "./pages/Dashboard/Payment";
import Map from "./pages/Dashboard/Map";
import NewCourseSelection from "./pages/Dashboard/NewCourseSelection";
import ShowCityCourses from "./pages/Dashboard/ShowCityCourses";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Map />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="new-course-selection" element={<NewCourseSelection />} />
        <Route path="course-selection" element={<CourseSelection />} />
        <Route path="city/:city" element={<ShowCityCourses />} />
        <Route path="payment" element={<Payment />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
