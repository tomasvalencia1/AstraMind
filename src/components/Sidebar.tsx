import { NavLink } from 'react-router-dom';
import { Home, Compass, Zap, Cpu, Settings, BookOpen } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <Zap className="logo-icon" size={28} />
          <h2 className="logo-text text-gradient">AstraMind</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/path" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Ruta de Aprendizaje</span>
        </NavLink>
        <NavLink to="/lab" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Prompt Lab</span>
        </NavLink>
        <NavLink to="/simulator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Cpu size={20} />
          <span>Simulador IA</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Ajustes</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
