import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import lessonsData from '../data/lessons.json';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';
import './LessonView.css';
import confetti from 'canvas-confetti';

const LessonView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { addXp, unlockModule, user } = useAppStore();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Find module data
  let moduleData: any = null;
  lessonsData.levels.forEach(level => {
    const found = level.modules.find(m => m.id === moduleId);
    if (found) moduleData = found;
  });

  useEffect(() => {
    if (!moduleData) {
      navigate('/path');
    }
  }, [moduleData, navigate]);

  if (!moduleData) return null;

  const handleOptionSelect = (index: number) => {
    if (isCompleted || isCorrect !== null) return;
    setSelectedOption(index);
    
    if (index === moduleData.correctAnswerIndex) {
      setIsCorrect(true);
      triggerSuccess(moduleData.xpReward);
    } else {
      setIsCorrect(false);
    }
  };

  const handleTheoryComplete = () => {
    triggerSuccess(moduleData.xpReward);
  };

  const triggerSuccess = (xp: number) => {
    setIsCompleted(true);
    addXp(xp);
    unlockModule(`completed-${moduleId}`);
    
    // Unlock next module logic
    let foundCurrent = false;
    let nextModuleId = null;
    
    for (const level of lessonsData.levels) {
      for (const mod of level.modules) {
        if (foundCurrent) {
          nextModuleId = mod.id;
          break;
        }
        if (mod.id === moduleId) {
          foundCurrent = true;
        }
      }
      if (nextModuleId) break;
    }

    if (nextModuleId) {
      unlockModule(nextModuleId);
    }
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#EC4899', '#10B981']
    });
  };

  const resetTry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <div className="lesson-container fade-in">
      <div className="lesson-header">
        <button className="btn btn-secondary" onClick={() => navigate('/path')}>
          Volver a la ruta
        </button>
        <div className="lesson-xp-badge">
          <Award size={18} /> +{moduleData.xpReward} XP
        </div>
      </div>

      <div className="lesson-content glass-panel">
        <h1 className="lesson-title">{moduleData.title}</h1>
        
        {moduleData.type === 'theory' && (
          <div className="theory-section">
            <p className="theory-text">{moduleData.content}</p>
            {!isCompleted ? (
              <button className="btn btn-primary btn-large mt-8" onClick={handleTheoryComplete}>
                He entendido, continuar
              </button>
            ) : (
              <div className="success-banner mt-8">
                <CheckCircle size={24} />
                <span>¡Lección completada! Has ganado {moduleData.xpReward} XP.</span>
                <button className="btn btn-primary" onClick={() => navigate('/path')}>
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {moduleData.type === 'interactive' && (
          <div className="interactive-section">
            <p className="question-text">{moduleData.question}</p>
            
            <div className="options-grid">
              {moduleData.options.map((opt: string, index: number) => {
                let optionClass = 'option-card';
                if (selectedOption === index) {
                  optionClass += isCorrect ? ' correct' : ' incorrect';
                } else if (isCorrect === false && selectedOption !== null) {
                   optionClass += ' disabled';
                }

                return (
                  <button 
                    key={index} 
                    className={optionClass}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null && isCorrect}
                  >
                    <div className="option-indicator">{String.fromCharCode(65 + index)}</div>
                    <div className="option-text">{opt}</div>
                  </button>
                );
              })}
            </div>

            {isCorrect === false && (
              <div className="feedback-banner error mt-8">
                <div className="feedback-header">
                  <XCircle size={24} />
                  <span>Respuesta incorrecta</span>
                </div>
                <p>{moduleData.explanation}</p>
                <button className="btn btn-secondary mt-4" onClick={resetTry}>
                  Intentar de nuevo
                </button>
              </div>
            )}

            {isCorrect === true && (
              <div className="feedback-banner success mt-8 fade-in">
                <div className="feedback-header">
                  <CheckCircle size={24} />
                  <span>¡Excelente deducción!</span>
                </div>
                <p>{moduleData.explanation}</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/path')}>
                  Siguiente Lección <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;
