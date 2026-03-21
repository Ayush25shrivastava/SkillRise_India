import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedLayout from "./components/layout/ProtectedLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewInterviewPage from "./pages/NewInterviewPage";
import InterviewDetailPage from "./pages/InterviewDetailPage";
import FeedbackPage from "./pages/FeedbackPage";
import InterviewsPage from "./pages/InterviewsPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/interviews/new" element={<NewInterviewPage />} />
              <Route path="/interviews/:id" element={<InterviewDetailPage />} />
              <Route path="/interviews/:id/feedback" element={<FeedbackPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
