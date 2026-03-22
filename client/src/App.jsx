import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/ProfileSetup.jsx";
import AICareerAssistant from "./pages/AICareerAssistant.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import SkillGapAnalysis from "./pages/SkillGapAnalysis.jsx";
import CareerExplorer from "./pages/CareerExplorer.jsx";

import LearningRoadmap from "./pages/RoadmapPage.jsx";


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

import ProfileSetup from "./pages/ProfileSetup";
import ProfileDashboard from "./pages/ProfileDashboard";
import Layout from "./components/Layout.jsx";
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
        <Route
  path="/profile"
  element={
    <Layout>
      <ProfileSetup />
    </Layout>
  }
/>
        <Route
  path="/profile/dashboard"
  element={
    <Layout>
      <ProfileDashboard />
    </Layout>
  }
/>
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

            <Route
              path="/interviews"
              element={
                <MockAuthProvider>
                  <MockToastProvider>
                    <InterviewsPage />
                  </MockToastProvider>
                </MockAuthProvider>
              }
            />
            <Route
              path="/interviews/new"
              element={
                <MockAuthProvider>
                  <MockToastProvider>
                    <NewInterviewPage />
                  </MockToastProvider>
                </MockAuthProvider>
              }
            />
            <Route
              path="/interviews/:id"
              element={
                <MockAuthProvider>
                  <MockToastProvider>
                    <InterviewDetailPage />
                  </MockToastProvider>
                </MockAuthProvider>
              }
            />
            <Route
              path="/interviews/:id/feedback"
              element={
                <MockAuthProvider>
                  <MockToastProvider>
                    <FeedbackPage />
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
