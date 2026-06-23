import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import LessonView from './pages/LessonView';
import PromptLab from './pages/PromptLab';
import Simulator from './pages/Simulator';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';

function App() {
  const updateStreak = useAppStore((state) => state.updateStreak);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="app-container">
      <div className="bg-animated"></div>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/path" element={<LearningPath />} />
          <Route path="/lesson/:moduleId" element={<LessonView />} />
          <Route path="/lab" element={<PromptLab />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
