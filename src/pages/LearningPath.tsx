import { useAppStore } from '../store/useAppStore';
import { Lock, CheckCircle2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import lessonsData from '../data/lessons.json';
import './LearningPath.css';

const LearningPath = () => {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();

  const handleModuleClick = (moduleId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      navigate(`/lesson/${moduleId}`);
    }
  };

  return (
    <div className="learning-path-container fade-in">
      <header className="path-header">
        <h1>Ruta de Aprendizaje</h1>
        <p className="subtitle">Desbloquea tu potencial módulo por módulo.</p>
      </header>

      <div className="path-timeline">
        {lessonsData.levels.map((level, levelIndex) => {
          const isLevelUnlocked = user.level >= level.requiredLevel;

          return (
            <div key={level.id} className={`level-section ${!isLevelUnlocked ? 'locked-level' : ''}`}>
              <div className="level-header">
                <div className="level-badge">Nivel {levelIndex + 1}</div>
                <h2>{level.title}</h2>
                <p>{level.description}</p>
                {!isLevelUnlocked && (
                  <div className="lock-overlay-text">
                    <Lock size={16} /> Requiere Nivel {level.requiredLevel}
                  </div>
                )}
              </div>

              <div className="modules-grid">
                {level.modules.map((mod, index) => {
                  const isUnlocked = user.unlockedModules.includes(mod.id);
                  const isCompleted = user.unlockedModules.includes(`completed-${mod.id}`); // Basic completion logic

                  return (
                    <div 
                      key={mod.id} 
                      className={`module-card glass-panel ${!isUnlocked && isLevelUnlocked ? 'locked-module' : ''} ${isCompleted ? 'completed-module' : ''}`}
                      onClick={() => handleModuleClick(mod.id, isUnlocked)}
                    >
                      <div className="module-icon">
                        {isCompleted ? (
                          <CheckCircle2 size={32} color="var(--color-success)" />
                        ) : isUnlocked ? (
                          <Play size={32} color="var(--color-primary)" />
                        ) : (
                          <Lock size={32} color="var(--color-text-tertiary)" />
                        )}
                      </div>
                      <div className="module-info">
                        <h3>Módulo {index + 1}: {mod.title}</h3>
                        <div className="module-tags">
                          <span className="xp-tag">+{mod.xpReward} XP</span>
                          <span className="type-tag">{mod.type === 'theory' ? 'Teoría' : 'Interactivo'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {level.modules.length === 0 && (
                  <div className="coming-soon">
                    <p>Más módulos en construcción...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
