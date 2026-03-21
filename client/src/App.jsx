import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import AICareerAssistant from "./pages/AICareerAssistant.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import SkillGapAnalysis from "./pages/SkillGapAnalysis.jsx";
import CareerExplorer from "./pages/CareerExplorer.jsx";
import LearningRoadmap from "./pages/LearningRoadmap.jsx";
import JobsAndInternships from "./pages/JobsAndInternships.jsx";
import GovernmentSchemes from "./pages/GovernmentSchemes.jsx";
import SkillProgress from "./pages/SkillProgress.jsx";
import Feedback from "./pages/Feedback.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import Chatbot from "./pages/Chatbot/Chatbot.jsx";
import Navbar from "./components/Navbar.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// New Mock Imports
import { AuthProvider as MockAuthProvider } from "./new-mock/context/AuthContext";
import { ToastProvider as MockToastProvider } from "./new-mock/components/ui/Toast";
import NewInterviewPage from "./new-mock/pages/NewInterviewPage";
import InterviewsPage from "./new-mock/pages/InterviewsPage";
import InterviewDetailPage from "./new-mock/pages/InterviewDetailPage";
import FeedbackPage from "./new-mock/pages/FeedbackPage";


function App() {

  return (

    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />}/>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai-assistant" element={<AICareerAssistant />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/skill-gap" element={<SkillGapAnalysis />} />
            <Route path="/career-explorer" element={<CareerExplorer />} />
            <Route path="/learning-roadmap" element={<LearningRoadmap />} />
            <Route path="/jobs" element={<JobsAndInternships />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/progress" element={<SkillProgress />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/new_mock" element={<InterviewPage />} />
            <Route path="/chatbot" element={<Chatbot />} />

            {/* Integrate New Mock UI */}
            <Route
              path="/interviews/*"
              element={
                <MockAuthProvider>
                  <MockToastProvider>
                    <Routes>
                      <Route index element={<InterviewsPage />} />
                      <Route path="new" element={<NewInterviewPage />} />
                      <Route path=":id" element={<InterviewDetailPage />} />
                      <Route path=":id/feedback" element={<FeedbackPage />} />
                    </Routes>
                  </MockToastProvider>
                </MockAuthProvider>
              }
            />
          </Route>
        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;
