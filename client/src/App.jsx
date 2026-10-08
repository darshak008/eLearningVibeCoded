import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import CoursePlayer from './pages/courses/CoursePlayer';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentWishlist from './pages/student/StudentWishlist';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentMessages from './pages/student/StudentMessages';
import StudentProfile from './pages/student/StudentProfile';
import StudentPaymentHistory from './pages/student/StudentPaymentHistory';
import StudentNotifications from './pages/student/StudentNotifications';

import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';
import InstructorEarnings from './pages/instructor/InstructorEarnings';
import InstructorReviews from './pages/instructor/InstructorReviews';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

import NotFound from './pages/NotFound';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-500 dark:text-dark-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/auth/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/courses/:slug/learn/:lessonId" element={<ProtectedRoute role="student"><CoursePlayer /></ProtectedRoute>} />

          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/my-courses" element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />
          <Route path="/student/wishlist" element={<ProtectedRoute role="student"><StudentWishlist /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute role="student"><StudentCertificates /></ProtectedRoute>} />
          <Route path="/student/messages" element={<ProtectedRoute role="student"><StudentMessages /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/payment-history" element={<ProtectedRoute role="student"><StudentPaymentHistory /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />

          <Route path="/instructor/dashboard" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><InstructorCourses /></ProtectedRoute>} />
          <Route path="/instructor/courses/create" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute role="instructor"><EditCourse /></ProtectedRoute>} />
          <Route path="/instructor/analytics" element={<ProtectedRoute role="instructor"><InstructorAnalytics /></ProtectedRoute>} />
          <Route path="/instructor/earnings" element={<ProtectedRoute role="instructor"><InstructorEarnings /></ProtectedRoute>} />
          <Route path="/instructor/reviews" element={<ProtectedRoute role="instructor"><InstructorReviews /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
