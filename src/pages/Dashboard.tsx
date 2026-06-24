import { useAppStore } from '../store/useAppStore';
import { Flame, Star, Trophy, Target } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const user = useAppStore((state) => state.user);

  return (
    <div className="dashboard-container fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Hola, Futuro Experto 👋</h1>
          <p className="subtitle">Tu camino hacia el dominio de la IA comienza aquí.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-primary)' }}>
            <Star size={24} />
          </div>
          <div className="stat-info">
            <h3>{user.xp}</h3>
            <p>Puntos de Experiencia</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <h3>{user.streak} Días</h3>
            <p>Racha Actual</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.2)', color: 'var(--color-secondary)' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <h3>Nivel {user.level}</h3>
            <p>Principiante</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="glass-panel main-panel">
          <div className="panel-header">
            <Target size={24} />
            <h2>Siguiente Lección Recomendada</h2>
          </div>
          <div className="lesson-preview">
            <h3>Fundamentos de Prompt Engineering</h3>
            <p>Aprende la anatomía básica de un prompt efectivo. Entiende la diferencia entre dar una instrucción simple y proporcionar contexto, rol y formato.</p>
            
            <div className="lesson-meta">
              <span>Nivel: Principiante</span>
              <span>Recompensa: 100 XP</span>
            </div>
            
            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
              Continuar Ruta
            </button>
          </div>
        </div>

        <div className="glass-panel side-panel">
          <h2>Tus Habilidades</h2>
          <div className="skills-list">
            <div className="skill-item">
              <div className="skill-header">
                <span>Prompt Básico</span>
                <span>40%</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-header">
                <span>Chain of Thought</span>
                <span>0%</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-header">
                <span>Selección de Modelo</span>
                <span>10%</span>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
