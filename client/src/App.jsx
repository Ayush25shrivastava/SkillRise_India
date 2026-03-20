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
            <Route path="/mock-interview" element={<InterviewPage />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;
