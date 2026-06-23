import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/module/:moduleId" element={<ModulePage />} />
    </Routes>
  );
}
