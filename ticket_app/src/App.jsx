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
import CourseSelection from "./pages/Dashboard/CourseSelection";
import Payment from "./pages/Dashboard/Payment";
import Map from "./pages/Dashboard/Map";
import NewCourseSelection from "./pages/Dashboard/NewCourseSelection";
import ShowCityCourses from "./pages/Dashboard/ShowCityCourses";
import RegionSelection from "./pages/Dashboard/RegionSelection";
import LandingPage from "./pages/Final/LandingPage";
import SelectRegionWithCourse from "./pages/Final/SelectRegionWithCourse";
import RegionCourseList from "./pages/Final/RegionCourseList";
import YourCart from "./pages/Final/YourCart";
import LockSeats from "./pages/Final/LockSeats";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/select-region/:courseType"
        element={<SelectRegionWithCourse />}
      />
      <Route
        path="/course-list/:city/:courseType"
        element={<RegionCourseList />}
      />
      <Route path="/cart" element={<YourCart />} />
      <Route path="/payment" element={<LockSeats />} />

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
        <Route path="map" element={<RegionSelection />} />
        <Route path="profile" element={<Profile />} />
        <Route path="new-course-selection" element={<NewCourseSelection />} />
        <Route
          path="new-course-selection/:courseType"
          element={<NewCourseSelection />}
        />
        <Route path="course-selection" element={<CourseSelection />} />
        <Route path="city/:city" element={<ShowCityCourses />} />
        <Route path="city/:city/:courseType" element={<ShowCityCourses />} />
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
