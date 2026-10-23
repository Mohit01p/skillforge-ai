import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/onboarding/Onboarding";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/roadmap/Roadmap";
import TopicDetail from "./pages/roadmap/TopicDetail";
import ProgressDashboard from "./pages/ProgressDashboard";
import Profile from "./pages/Profile";
import AITools from "./pages/ai/AITools";
import RoadmapGenerator from "./pages/ai/RoadmapGenerator";
import SkillGap from "./pages/ai/SkillGap";
import DailyPlanner from "./pages/ai/DailyPlanner";
import ProjectIdeas from "./pages/ai/ProjectIdeas";
import MentorChat from "./pages/ai/MentorChat";
import Quiz from "./pages/quiz/Quiz";
import InterviewPrep from "./pages/interview/InterviewPrep";
import Resume from "./pages/resume/Resume";
import DocumentChat from "./pages/document/DocumentChat";
import Roadmaps from "./pages/roadmap/Roadmaps";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/roadmap/:roadmapId" element={<Roadmap />} />
        <Route path="/topic/:roadmapId/:topicId" element={<TopicDetail />} />
        <Route path="/progress" element={<ProgressDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai" element={<AITools />} />
        <Route path="/ai/roadmap-generator" element={<RoadmapGenerator />} />
        <Route path="/ai/skill-gap" element={<SkillGap />} />
        <Route path="/ai/daily-planner" element={<DailyPlanner />} />
        <Route path="/ai/project-ideas" element={<ProjectIdeas />} />
        <Route path="/ai/mentor" element={<MentorChat />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/document" element={<DocumentChat />} />
      </Route>
    </Routes>
  );
}

export default App;